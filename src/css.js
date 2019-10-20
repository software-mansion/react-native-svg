import React, { useEffect, useMemo, useState } from 'react';
import { camelCase, parse, SvgAst } from './xml';
import baseCssAdapter from 'css-select-base-adapter';
import csstree, { List } from 'css-tree';
import cssSelect from 'css-select';
import stable from 'stable';

/*
 * Style element inlining experiment based on SVGO
 * */

/**
 * DOMUtils API for rnsvg AST (used by css-select)
 */
const rnsvgCssSelectAdapterMin = {
  // is the node a tag?
  // isTag: ( node:Node ) => isTag:Boolean
  isTag(node) {
    return node.tag;
  },

  // get the parent of the node
  // getParent: ( node:Node ) => parentNode:Node
  // returns null when no parent exists
  getParent(node) {
    return node.parent || null;
  },

  // get the node's children
  // getChildren: ( node:Node ) => children:[Node]
  getChildren(node) {
    return node.children || [];
  },

  // get the name of the tag
  // getName: ( elem:ElementNode ) => tagName:String
  getName(elemAst) {
    return elemAst.tag;
  },

  // get the text content of the node, and its children if it has any
  // getText: ( node:Node ) => text:String
  // returns empty string when there is no text
  getText() {
    return '';
  },

  // get the attribute value
  // getAttributeValue: ( elem:ElementNode, name:String ) => value:String
  // returns null when attribute doesn't exist
  getAttributeValue(elem, name) {
    return elem && elem.props.hasOwnProperty(name) ? elem.props[name] : null;
  },
};

// use base adapter for default implementation
const rnsvgCssSelectAdapter = baseCssAdapter(rnsvgCssSelectAdapterMin);

/**
 * Evaluate a string of CSS selectors against the element and returns matched elements.
 *
 * @param {Object} document to select elements from
 * @param {String} selectors CSS selector(s) string
 * @return {Array} null if no elements matched
 */
function querySelectorAll(document, selectors) {
  const matchedEls = cssSelect(selectors, document, cssSelectOpts);

  return matchedEls.length > 0 ? matchedEls : null;
}
const cssSelectOpts = {
  xmlMode: true,
  adapter: rnsvgCssSelectAdapter,
};

function specificity(simpleSelector) {
  let A = 0;
  let B = 0;
  let C = 0;

  simpleSelector.children.each(function walk(node) {
    switch (node.type) {
      case 'SelectorList':
      case 'Selector':
        node.children.each(walk);
        break;

      case 'IdSelector':
        A++;
        break;

      case 'ClassSelector':
      case 'AttributeSelector':
        B++;
        break;

      case 'PseudoClassSelector':
        switch (node.name.toLowerCase()) {
          case 'not':
            node.children.each(walk);
            break;

          case 'before':
          case 'after':
          case 'first-line':
          case 'first-letter':
            C++;
            break;

          // TODO: support for :nth-*(.. of <SelectorList>), :matches(), :has()

          default:
            B++;
        }
        break;

      case 'PseudoElementSelector':
        C++;
        break;

      case 'TypeSelector':
        // ignore universal selector
        if (node.name.charAt(node.name.length - 1) !== '*') {
          C++;
        }
        break;
    }
  });

  return [A, B, C];
}

/**
 * Flatten a CSS AST to a selectors list.
 *
 * @param {Object} cssAst css-tree AST to flatten
 * @return {Array} selectors
 */
function flattenToSelectors(cssAst) {
  const selectors = [];

  csstree.walk(cssAst, {
    visit: 'Rule',
    enter(node) {
      if (node.type !== 'Rule') {
        return;
      }

      const atrule = this.atrule;
      const rule = node;

      node.prelude.children.each((selectorNode, selectorItem) => {
        const selector = {
          item: selectorItem,
          atrule: atrule,
          rule: rule,
          pseudos: [],
        };

        selectorNode.children.each(
          (selectorChildNode, selectorChildItem, selectorChildList) => {
            if (
              selectorChildNode.type === 'PseudoClassSelector' ||
              selectorChildNode.type === 'PseudoElementSelector'
            ) {
              selector.pseudos.push({
                item: selectorChildItem,
                list: selectorChildList,
              });
            }
          },
        );

        selectors.push(selector);
      });
    },
  });

  return selectors;
}

/**
 * Filter selectors by Media Query.
 *
 * @param {Array} selectors to filter
 * @param {Array} useMqs Array with strings of media queries that should pass (<name> <expression>)
 * @return {Array} Filtered selectors that match the passed media queries
 */
function filterByMqs(selectors, useMqs) {
  return selectors.filter(selector => {
    if (selector.atrule === null) {
      return ~useMqs.indexOf('');
    }

    const mqName = selector.atrule.name;
    let mqStr = mqName;
    if (
      selector.atrule.expression &&
      selector.atrule.expression.children.first().type === 'MediaQueryList'
    ) {
      const mqExpr = csstree.generate(selector.atrule.expression);
      mqStr = [mqName, mqExpr].join(' ');
    }

    return ~useMqs.indexOf(mqStr);
  });
}

/**
 * Filter selectors by the pseudo-elements and/or -classes they contain.
 *
 * @param {Array} selectors to filter
 * @param {Array} usePseudos Array with strings of single or sequence of pseudo-elements and/or -classes that should pass
 * @return {Array} Filtered selectors that match the passed pseudo-elements and/or -classes
 */
function filterByPseudos(selectors, usePseudos) {
  return selectors.filter(selector => {
    const pseudoSelectorsStr = csstree.generate({
      type: 'Selector',
      children: new List().fromArray(
        selector.pseudos.map(pseudo => {
          return pseudo.item.data;
        }),
      ),
    });
    return ~usePseudos.indexOf(pseudoSelectorsStr);
  });
}

/**
 * Remove pseudo-elements and/or -classes from the selectors for proper matching.
 *
 * @param {Array} selectors to clean
 * @return {Array} Selectors without pseudo-elements and/or -classes
 */
function cleanPseudos(selectors) {
  selectors.forEach(selector => {
    selector.pseudos.forEach(pseudo => {
      pseudo.list.remove(pseudo.item);
    });
  });
}

/**
 * Compares two selector specificities.
 * extracted from https://github.com/keeganstreet/specificity/blob/master/specificity.js#L211
 *
 * @param {Array} aSpecificity Specificity of selector A
 * @param {Array} bSpecificity Specificity of selector B
 * @return {Number} Score of selector specificity A compared to selector specificity B
 */
function compareSpecificity(aSpecificity, bSpecificity) {
  for (let i = 0; i < 4; i += 1) {
    if (aSpecificity[i] < bSpecificity[i]) {
      return -1;
    } else if (aSpecificity[i] > bSpecificity[i]) {
      return 1;
    }
  }

  return 0;
}

/**
 * Compare two simple selectors.
 *
 * @param {Object} aSimpleSelectorNode Simple selector A
 * @param {Object} bSimpleSelectorNode Simple selector B
 * @return {Number} Score of selector A compared to selector B
 */
function compareSimpleSelectorNode(aSimpleSelectorNode, bSimpleSelectorNode) {
  const aSpecificity = specificity(aSimpleSelectorNode),
    bSpecificity = specificity(bSimpleSelectorNode);
  return compareSpecificity(aSpecificity, bSpecificity);
}

function _bySelectorSpecificity(selectorA, selectorB) {
  return compareSimpleSelectorNode(selectorA.item.data, selectorB.item.data);
}

/**
 * Sort selectors stably by their specificity.
 *
 * @param {Array} selectors to be sorted
 * @return {Array} Stable sorted selectors
 */
function sortSelectors(selectors) {
  return stable(selectors, _bySelectorSpecificity);
}

/**
 * Convert a css-tree AST style declaration to CSSStyleDeclaration property.
 *
 * @param {Object} declaration css-tree style declaration
 * @return {Object} CSSStyleDeclaration property
 */
function csstreeToStyleDeclaration(declaration) {
  const propertyName = declaration.property,
    propertyValue = csstree.generate(declaration.value),
    propertyPriority = declaration.important ? 'important' : '';
  return {
    name: propertyName,
    value: propertyValue,
    priority: propertyPriority,
  };
}

/**
 * Gets the CSS string of a style element
 *
 * @param {Object} element style element
 * @return {String|Array} CSS string or empty array if no styles are set
 */
function getCssStr(element) {
  return element.children || [];
}

const CSSStyleDeclaration = function(node) {
  this.parentNode = node;

  this.properties = new Map();
  this.hasSynced = false;

  this.styleAttr = null;
  this.styleValue = null;

  this.parseError = false;
};

/**
 * Performs a deep clone of this object.
 *
 * @param parentNode the parentNode to assign to the cloned result
 */
CSSStyleDeclaration.prototype.clone = function(parentNode) {
  let nodeData = {};

  Object.keys(this).forEach(key => {
    if (key !== 'parentNode') {
      nodeData[key] = this[key];
    }
  });

  // Deep-clone node data.
  nodeData = JSON.parse(JSON.stringify(nodeData));

  const clone = new CSSStyleDeclaration(parentNode);
  Object.assign(clone, nodeData);
  return clone;
};

// attr.style

CSSStyleDeclaration.prototype.addStyleHandler = function() {
  this.styleAttr = {
    // empty style attr
    name: 'style',
    value: null,
  };

  Object.defineProperty(this.parentNode, 'styles', {
    get: this.getStyleAttr.bind(this),
    set: this.setStyleAttr.bind(this),
    enumerable: true,
    configurable: true,
  });

  this.addStyleValueHandler();
};

// attr.style.value

CSSStyleDeclaration.prototype.addStyleValueHandler = function() {
  Object.defineProperty(this.styleAttr, 'value', {
    get: this.getStyleValue.bind(this),
    set: this.setStyleValue.bind(this),
    enumerable: true,
    configurable: true,
  });
};

CSSStyleDeclaration.prototype.getStyleAttr = function() {
  return this.styleAttr;
};

CSSStyleDeclaration.prototype.setStyleAttr = function(newStyleAttr) {
  this.setStyleValue(newStyleAttr.value); // must before applying value handler!

  this.styleAttr = newStyleAttr;
  this.addStyleValueHandler();
  this.hasSynced = false; // raw css changed
};

CSSStyleDeclaration.prototype.getStyleValue = function() {
  return this.getCssText();
};

CSSStyleDeclaration.prototype.setStyleValue = function(newValue) {
  this.properties.clear(); // reset all existing properties
  this.styleValue = newValue;
  this.hasSynced = false; // raw css changed
};

CSSStyleDeclaration.prototype._loadCssText = function() {
  if (this.hasSynced) {
    return;
  }
  this.hasSynced = true; // must be set here to prevent loop in setProperty(...)

  if (!this.styleValue || this.styleValue.length === 0) {
    return;
  }
  const inlineCssStr = this.styleValue;

  let declarations = {};
  try {
    declarations = csstree.parse(inlineCssStr, {
      context: 'declarationList',
      parseValue: false,
    });
  } catch (parseError) {
    this.parseError = parseError;
    return;
  }
  this.parseError = false;

  declarations.children.each(declaration => {
    try {
      const styleDeclaration = csstreeToStyleDeclaration(declaration);
      this.setProperty(
        styleDeclaration.name,
        styleDeclaration.value,
        styleDeclaration.priority,
      );
    } catch (styleError) {
      if (styleError.message !== 'Unknown node type: undefined') {
        this.parseError = styleError;
      }
    }
  });
};

// only reads from properties

/**
 * Get the textual representation of the declaration block (equivalent to .cssText attribute).
 *
 * @return {String} Textual representation of the declaration block (empty string for no properties)
 */
CSSStyleDeclaration.prototype.getCssText = function() {
  const properties = this.getProperties();

  if (this.parseError) {
    // in case of a parse error, pass through original styles
    return this.styleValue;
  }

  const cssText = [];
  properties.forEach((property, propertyName) => {
    const strImportant = property.priority === 'important' ? '!important' : '';
    cssText.push(
      propertyName.trim() + ':' + property.value.trim() + strImportant,
    );
  });
  return cssText.join(';');
};

CSSStyleDeclaration.prototype._handleParseError = function() {
  if (this.parseError) {
    console.warn(
      "Warning: Parse error when parsing inline styles, style properties of this element cannot be used. The raw styles can still be get/set using .attr('style').value. Error details: " +
        this.parseError,
    );
  }
};

CSSStyleDeclaration.prototype._getProperty = function(propertyName) {
  if (typeof propertyName === 'undefined') {
    throw Error('1 argument required, but only 0 present.');
  }

  const properties = this.getProperties();
  this._handleParseError();

  return properties.get(propertyName.trim());
};

/**
 * Return the optional priority, "important".
 *
 * @param {String} propertyName representing the property name to be checked.
 * @return {String} priority that represents the priority (e.g. "important") if one exists. If none exists, returns the empty string.
 */
CSSStyleDeclaration.prototype.getPropertyPriority = function(propertyName) {
  const property = this._getProperty(propertyName);
  return property ? property.priority : '';
};

/**
 * Return the property value given a property name.
 *
 * @param {String} propertyName representing the property name to be checked.
 * @return {String} value containing the value of the property. If not set, returns the empty string.
 */
CSSStyleDeclaration.prototype.getPropertyValue = function(propertyName) {
  const property = this._getProperty(propertyName);
  return property ? property.value : null;
};

/**
 * Return a property name.
 *
 * @param {Number} index of the node to be fetched. The index is zero-based.
 * @return {String} propertyName that is the name of the CSS property at the specified index.
 */
CSSStyleDeclaration.prototype.item = function(index) {
  if (typeof index === 'undefined') {
    throw Error('1 argument required, but only 0 present.');
  }

  const properties = this.getProperties();
  this._handleParseError();

  return Array.from(properties.keys())[index];
};

/**
 * Return all properties of the node.
 *
 * @return {Map} properties that is a Map with propertyName as key and property (propertyValue + propertyPriority) as value.
 */
CSSStyleDeclaration.prototype.getProperties = function() {
  this._loadCssText();
  return this.properties;
};

// writes to properties

/**
 * Modify an existing CSS property or creates a new CSS property in the declaration block.
 *
 * @param {String} propertyName representing the CSS property name to be modified.
 * @param {String} [value] containing the new property value. If not specified, treated as the empty string. value must not contain "!important" -- that should be set using the priority parameter.
 * @param {String} [priority] allowing the "important" CSS priority to be set. If not specified, treated as the empty string.
 * @return {undefined}
 */
CSSStyleDeclaration.prototype.setProperty = function(
  propertyName,
  value,
  priority,
) {
  if (typeof propertyName === 'undefined') {
    throw Error('propertyName argument required, but only not present.');
  }

  const properties = this.getProperties();
  this._handleParseError();

  let trimmedValue = value.trim();
  const property = {
    value: trimmedValue,
    priority: priority.trim(),
  };
  let key = propertyName.trim();
  properties.set(key, property);
  this.parentNode.props.style[camelCase(key)] = trimmedValue;

  return property;
};

/**
 * Moves + merges styles from style elements to element styles
 *
 * Options
 *   onlyMatchedOnce (default: true)
 *     inline only selectors that match once
 *
 *   useMqs (default: ['', 'screen'])
 *     what media queries to be used
 *     empty string element for styles outside media queries
 *
 *   usePseudos (default: [''])
 *     what pseudo-classes/-elements to be used
 *     empty string element for all non-pseudo-classes and/or -elements
 *
 * @param {Object} document document element
 * @param {Object} opts plugin params
 *
 * @author strarsis <strarsis@gmail.com>
 */
const opts = {
  onlyMatchedOnce: true,
  useMqs: ['', 'screen'],
  usePseudos: [''],
};

function initStyle(selectedEl) {
  if (!selectedEl.style) {
    let value = selectedEl.styles || '';
    if (!selectedEl.props.style) {
      selectedEl.props.style = {};
    }
    selectedEl.style = new CSSStyleDeclaration(selectedEl);
    selectedEl.style.addStyleHandler();
    selectedEl.styles = {
      name: 'style',
      value: value,
      prefix: '',
      local: '',
    };
  }
}

export function inlineStyles(document) {
  // collect <style/>s
  const styleEls = querySelectorAll(document, 'style');

  //no <styles/>s, nothing to do
  if (styleEls === null) {
    return document;
  }

  let selectors = [];

  for (let styleEl of styleEls) {
    if (!styleEl.children.length /* || styleEl.closestElem('foreignObject')*/) {
      // skip empty <style/>s or <foreignObject> content.
      continue;
    }

    const cssStr = getCssStr(styleEl);

    // collect <style/>s and their css ast
    let cssAst = {};
    try {
      cssAst = csstree.parse(cssStr, {
        parseValue: false,
        parseCustomProperty: false,
      });
    } catch (parseError) {
      console.warn(
        'Warning: Parse error of styles of <style/> element, skipped. Error details: ' +
          parseError,
      );
      continue;
    }

    selectors = selectors.concat(flattenToSelectors(cssAst));
  }

  // filter for mediaqueries to be used or without any mediaquery
  const selectorsMq = filterByMqs(selectors, opts.useMqs);

  // filter for pseudo elements to be used
  const selectorsPseudo = filterByPseudos(selectorsMq, opts.usePseudos);

  // remove PseudoClass from its SimpleSelector for proper matching
  cleanPseudos(selectorsPseudo);

  // stable sort selectors
  const sortedSelectors = sortSelectors(selectorsPseudo).reverse();

  let selector, selectedEl;

  // match selectors
  for (selector of sortedSelectors) {
    const selectorStr = csstree.generate(selector.item.data);
    let selectedEls = null;

    try {
      selectedEls = querySelectorAll(document, selectorStr);
    } catch (selectError) {
      if (selectError.constructor === SyntaxError) {
        // console.warn('Warning: Syntax error when trying to select \n\n' + selectorStr + '\n\n, skipped. Error details: ' + selectError);
        continue;
      }
      throw selectError;
    }

    if (selectedEls === null) {
      // nothing selected
      continue;
    }

    selector.selectedEls = selectedEls;
  }

  // apply <style/> styles to matched elements
  for (selector of sortedSelectors) {
    if (!selector.selectedEls) {
      continue;
    }

    if (
      opts.onlyMatchedOnce &&
      selector.selectedEls !== null &&
      selector.selectedEls.length > 1
    ) {
      // skip selectors that match more than once if option onlyMatchedOnce is enabled
      continue;
    }

    // apply <style/> to matched elements
    for (selectedEl of selector.selectedEls) {
      if (selector.rule === null) {
        continue;
      }

      // merge declarations
      csstree.walk(selector.rule, {
        visit: 'Declaration',
        enter(styleCsstreeDeclaration) {
          // existing inline styles have higher priority
          // no inline styles, external styles,                                    external styles used
          // inline styles,    external styles same   priority as inline styles,   inline   styles used
          // inline styles,    external styles higher priority than inline styles, external styles used
          const styleDeclaration = csstreeToStyleDeclaration(
            styleCsstreeDeclaration,
          );
          initStyle(selectedEl);
          if (
            selectedEl.style.getPropertyValue(styleDeclaration.name) !== null &&
            selectedEl.style.getPropertyPriority(styleDeclaration.name) >=
              styleDeclaration.priority
          ) {
            return;
          }
          selectedEl.style.setProperty(
            styleDeclaration.name,
            styleDeclaration.value,
            styleDeclaration.priority,
          );
        },
      });
    }
  }

  return document;
}

export function SvgCss(props) {
  const { xml, override } = props;
  const ast = useMemo(() => (xml !== null ? parse(xml, inlineStyles) : null), [
    xml,
  ]);
  return <SvgAst ast={ast} override={override || props} />;
}

async function fetchText(uri) {
  const response = await fetch(uri);
  return await response.text();
}

const err = console.error.bind(console);

export function SvgCssUri(props) {
  const { uri } = props;
  const [xml, setXml] = useState(null);
  useEffect(() => {
    uri
      ? fetchText(uri)
          .then(setXml)
          .catch(err)
      : setXml(null);
  }, [uri]);
  return <SvgCss xml={xml} override={props} />;
}

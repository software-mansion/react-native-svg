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
 * @return {Array}
 */
function querySelectorAll(document, selectors) {
  return cssSelect(selectors, document, cssSelectOpts);
}
const cssSelectOpts = {
  xmlMode: true,
  adapter: rnsvgCssSelectAdapter,
};

/**
 * Flatten a CSS AST to a selectors list.
 *
 * @param {Object} cssAst css-tree AST to flatten
 * @param {Array} selectors
 */
function flattenToSelectors(cssAst, selectors) {
  csstree.walk(cssAst, {
    visit: 'Rule',
    enter(rule) {
      const { type, prelude } = rule;
      if (type !== 'Rule') {
        return;
      }
      const atrule = this.atrule;
      prelude.children.each(({ children }, item) => {
        const pseudos = [];
        selectors.push({
          item,
          atrule,
          rule,
          pseudos,
        });
        children.each(({ type: childType }, pseudoItem, list) => {
          if (
            childType === 'PseudoClassSelector' ||
            childType === 'PseudoElementSelector'
          ) {
            pseudos.push({
              item: pseudoItem,
              list,
            });
          }
        });
      });
    },
  });
}

/**
 * Filter selectors by Media Query.
 *
 * @param {Array} selectors to filter
 * @return {Array} Filtered selectors that match the passed media queries
 */
function filterByMqs(selectors) {
  return selectors.filter(({ atrule }) => {
    if (atrule === null) {
      return ~useMqs.indexOf('');
    }
    const { name, expression } = atrule;
    return ~useMqs.indexOf(
      expression && expression.children.first().type === 'MediaQueryList'
        ? [name, csstree.generate(expression)].join(' ')
        : name,
    );
  });
}
// useMqs Array with strings of media queries that should pass (<name> <expression>)
const useMqs = ['', 'screen'];

/**
 * Filter selectors by the pseudo-elements and/or -classes they contain.
 *
 * @param {Array} selectors to filter
 * @return {Array} Filtered selectors that match the passed pseudo-elements and/or -classes
 */
function filterByPseudos(selectors) {
  return selectors.filter(
    ({ pseudos }) =>
      ~usePseudos.indexOf(
        csstree.generate({
          type: 'Selector',
          children: new List().fromArray(
            pseudos.map(pseudo => pseudo.item.data),
          ),
        }),
      ),
  );
}
// usePseudos Array with strings of single or sequence of pseudo-elements and/or -classes that should pass
const usePseudos = [''];

/**
 * Remove pseudo-elements and/or -classes from the selectors for proper matching.
 *
 * @param {Array} selectors to clean
 * @return {Array} Selectors without pseudo-elements and/or -classes
 */
function cleanPseudos(selectors) {
  selectors.forEach(({ pseudos }) =>
    pseudos.forEach(pseudo => pseudo.list.remove(pseudo.item)),
  );
}

function specificity(selector) {
  let A = 0;
  let B = 0;
  let C = 0;

  selector.children.each(function walk(node) {
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
        const { name } = node;
        if (name.charAt(name.length - 1) !== '*') {
          C++;
        }
        break;
    }
  });

  return [A, B, C];
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
 * @param {Object} selectorA Simple selector A
 * @param {Object} selectorB Simple selector B
 * @return {Number} Score of selector A compared to selector B
 */
function bySelectorSpecificity(selectorA, selectorB) {
  const aSpecificity = specificity(selectorA.item.data),
    bSpecificity = specificity(selectorB.item.data);
  return compareSpecificity(aSpecificity, bSpecificity);
}

/**
 * Sort selectors stably by their specificity.
 *
 * @param {Array} selectors to be sorted
 * @return {Array} Stable sorted selectors
 */
function sortSelectors(selectors) {
  return stable(selectors, bySelectorSpecificity);
}

const declarationParseProps = {
  context: 'declarationList',
  parseValue: false,
};
function CSSStyleDeclaration({ props: { style }, styles }) {
  const properties = new Map();
  const styleDeclaration = {
    style,
    properties,
  };
  if (!styles || styles.length === 0) {
    return styleDeclaration;
  }
  try {
    csstree
      .parse(styles, declarationParseProps)
      .children.each(({ property, value, important }) => {
        try {
          const name = property.trim();
          properties.set(name, important);
          style[camelCase(name)] = csstree.generate(value).trim();
        } catch (styleError) {
          if (styleError.message !== 'Unknown node type: undefined') {
            console.warn(
              "Warning: Parse error when parsing inline styles, style properties of this element cannot be used. The raw styles can still be get/set using .attr('style').value. Error details: " +
                styleError,
            );
          }
        }
      });
  } catch (parseError) {
    console.warn(
      "Warning: Parse error when parsing inline styles, style properties of this element cannot be used. The raw styles can still be get/set using .attr('style').value. Error details: " +
        parseError,
    );
  }
  return styleDeclaration;
}

function initStyle(selectedEl) {
  if (!selectedEl.style) {
    if (!selectedEl.props.style) {
      selectedEl.props.style = {};
    }
    selectedEl.style = CSSStyleDeclaration(selectedEl);
  }
}

/**
 * Find the closest ancestor of the current element.
 * @param node
 * @param elemName
 * @return {?Object}
 */
function closestElem(node, elemName) {
  let elem = node;
  while ((elem = elem.parent) && elem.tag !== elemName) {}
  return elem;
}

const parseProps = {
  parseValue: false,
  parseCustomProperty: false,
};

/**
 * Moves + merges styles from style elements to element styles
 *
 * Options
 *   useMqs (default: ['', 'screen'])
 *     what media queries to be used
 *     empty string element for styles outside media queries
 *
 *   usePseudos (default: [''])
 *     what pseudo-classes/-elements to be used
 *     empty string element for all non-pseudo-classes and/or -elements
 *
 * @param {Object} document document element
 *
 * @author strarsis <strarsis@gmail.com>
 * @author modified by: msand <msand@abo.fim>
 */
export function inlineStyles(document) {
  // collect <style/>s
  const styleElements = querySelectorAll(document, 'style');

  //no <styles/>s, nothing to do
  if (styleElements.length === 0) {
    return document;
  }

  const selectors = [];

  for (let element of styleElements) {
    const { children } = element;
    if (!children.length || closestElem(element, 'foreignObject')) {
      // skip empty <style/>s or <foreignObject> content.
      continue;
    }

    // collect <style/>s and their css ast
    try {
      flattenToSelectors(csstree.parse(children, parseProps), selectors);
    } catch (parseError) {
      console.warn(
        'Warning: Parse error of styles of <style/> element, skipped. Error details: ' +
          parseError,
      );
    }
  }

  // filter for mediaqueries to be used or without any mediaquery
  const selectorsMq = filterByMqs(selectors);

  // filter for pseudo elements to be used
  const selectorsPseudo = filterByPseudos(selectorsMq);

  // remove PseudoClass from its SimpleSelector for proper matching
  cleanPseudos(selectorsPseudo);

  // stable sort selectors
  const sortedSelectors = sortSelectors(selectorsPseudo).reverse();

  // match selectors
  for (let { rule, item } of sortedSelectors) {
    if (rule === null) {
      continue;
    }
    const selectorStr = csstree.generate(item.data);
    try {
      // apply <style/> to matched elements
      const matched = querySelectorAll(document, selectorStr);
      if (matched.length === 0) {
        continue;
      }
      for (let element of matched) {
        initStyle(element);
      }
      csstree.walk(rule, {
        visit: 'Declaration',
        enter({ property, value, important }) {
          // existing inline styles have higher priority
          // no inline styles, external styles,                                    external styles used
          // inline styles,    external styles same   priority as inline styles,   inline   styles used
          // inline styles,    external styles higher priority than inline styles, external styles used
          const name = property.trim();
          const camel = camelCase(name);
          const val = csstree.generate(value).trim();
          for (let element of matched) {
            const { style, properties } = element.style;
            const current = properties.get(name);
            if (current === undefined || current < important) {
              properties.set(name, important);
              style[camel] = val;
            }
          }
        },
      });
    } catch (selectError) {
      if (selectError.constructor === SyntaxError) {
        console.warn(
          'Warning: Syntax error when trying to select \n\n' +
            selectorStr +
            '\n\n, skipped. Error details: ' +
            selectError,
        );
        continue;
      }
      throw selectError;
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

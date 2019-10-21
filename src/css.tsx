import React, { useEffect, useMemo, useState } from 'react';
import {
  AST,
  camelCase,
  err,
  fetchText,
  parse,
  Styles,
  SvgAst,
  UriProps,
  XmlProps,
} from './xml';
import csstree, {
  Atrule,
  CssNode,
  Declaration,
  DeclarationList,
  List,
  ListItem,
  PseudoClassSelector,
  Rule,
  Selector,
  SelectorList,
} from 'css-tree';
// @ts-ignore
import cssSelect, { CSSselect } from 'css-select';
import stable from 'stable';

/*
 * Style element inlining experiment based on SVGO
 * */

/**
 * DOMUtils API for rnsvg AST (used by css-select)
 */
// is the node a tag?
// isTag: ( node:Node ) => isTag:Boolean
function isTag(node: CSSselect.Node): node is CSSselect.ElementNode {
  return node.tag;
}

// get the parent of the node
// getParent: ( node:Node ) => parentNode:Node
// returns null when no parent exists
function getParent(node: AST) {
  return node.parent || null;
}

// get the node's children
// getChildren: ( node:Node ) => children:[Node]
function getChildren(node: AST) {
  return node.children || [];
}

// get the name of the tag
// getName: ( elem:ElementNode ) => tagName:String
function getName(elemAst: AST) {
  return elemAst.tag;
}

// get the text content of the node, and its children if it has any
// getText: ( node:Node ) => text:String
// returns empty string when there is no text
function getText() {
  return '';
}

// get the attribute value
// getAttributeValue: ( elem:ElementNode, name:String ) => value:String
// returns null when attribute doesn't exist
function getAttributeValue(elem: CSSselect.ElementNode, name: string): string {
  return elem.props[name];
}

// takes an array of nodes, and removes any duplicates, as well as any nodes
// whose ancestors are also in the array
function removeSubsets(nodes: Array<CSSselect.Node>): Array<CSSselect.Node> {
  let idx = nodes.length,
    node,
    ancestor,
    replace;

  // Check if each node (or one of its ancestors) is already contained in the
  // array.
  while (--idx > -1) {
    node = ancestor = nodes[idx];

    // Temporarily remove the node under consideration
    nodes[idx] = null;
    replace = true;

    while (ancestor) {
      if (nodes.indexOf(ancestor) > -1) {
        replace = false;
        nodes.splice(idx, 1);
        break;
      }
      ancestor = getParent(ancestor);
    }

    // If the node has been found to be unique, re-insert it.
    if (replace) {
      nodes[idx] = node;
    }
  }

  return nodes;
}

// does at least one of passed element nodes pass the test predicate?
function existsOne(
  test: CSSselect.Predicate<CSSselect.ElementNode>,
  elems: Array<CSSselect.ElementNode>,
): boolean {
  return elems.some(function(elem) {
    return isTag(elem)
      ? // eslint-disable-next-line jest/no-disabled-tests
        test(elem) || existsOne(test, getChildren(elem))
      : false;
  });
}

/*
  get the siblings of the node. Note that unlike jQuery's `siblings` method,
  this is expected to include the current node as well
*/
function getSiblings(node: CSSselect.Node): Array<CSSselect.Node> {
  const parent = getParent(node);
  return (parent && getChildren(parent)) as Array<CSSselect.Node>;
}

// does the element have the named attribute?
function hasAttrib(elem: AST, name: string) {
  return elem.props.hasOwnProperty(name);
}

// finds the first node in the array that matches the test predicate, or one
// of its children
function findOne(
  test: CSSselect.Predicate<CSSselect.ElementNode>,
  elems: Array<CSSselect.ElementNode>,
): CSSselect.ElementNode | undefined {
  let elem = null;

  for (let i = 0, l = elems.length; i < l && !elem; i++) {
    // eslint-disable-next-line jest/no-disabled-tests
    if (test(elems[i])) {
      elem = elems[i];
    } else {
      const childs = getChildren(elems[i]);
      if (childs && childs.length > 0) {
        elem = findOne(test, childs);
      }
    }
  }

  return elem;
}

// finds all of the element nodes in the array that match the test predicate,
// as well as any of their children that match it
function findAll(
  test: CSSselect.Predicate<CSSselect.ElementNode>,
  nodes: Array<CSSselect.Node>,
): Array<CSSselect.ElementNode> {
  let result = [];

  for (let i = 0, j = nodes.length; i < j; i++) {
    if (!isTag(nodes[i])) {
      continue;
    }
    // eslint-disable-next-line jest/no-disabled-tests
    if (test(nodes[i])) {
      result.push(nodes[i]);
    }
    const childs = getChildren(nodes[i]);
    if (childs) {
      result = result.concat(findAll(test, childs));
    }
  }

  return result;
}

/**
 * Evaluate a string of CSS selectors against the element and returns matched elements.
 *
 * @param {Object} document to select elements from
 * @param {String} selectors CSS selector(s) string
 * @return {Array}
 */
function querySelectorAll(document: AST, selectors: string) {
  return cssSelect(selectors, document, cssSelectOpts);
}
const cssSelectOpts = {
  xmlMode: true,
  adapter: {
    removeSubsets,
    existsOne,
    getSiblings,
    hasAttrib,
    findOne,
    findAll,
    isTag,
    getParent,
    getChildren,
    getName,
    getText,
    getAttributeValue,
  },
};

type FlatPseudoSelector = {
  item: ListItem<CssNode>;
  list: List<CssNode>;
};
type FlatPseudoSelectorList = FlatPseudoSelector[];
type FlatSelector = {
  item: ListItem<CssNode>;
  atrule: Atrule | null;
  rule: CssNode;
  pseudos: FlatPseudoSelectorList;
};
type FlatSelectorList = FlatSelector[];

/**
 * Flatten a CSS AST to a selectors list.
 *
 * @param {Object} cssAst css-tree AST to flatten
 * @param {Array} selectors
 */
function flattenToSelectors(cssAst: CssNode, selectors: FlatSelectorList) {
  csstree.walk(cssAst, {
    visit: 'Rule',
    enter(rule: CssNode) {
      const { type, prelude } = rule as Rule;
      if (type !== 'Rule') {
        return;
      }
      const atrule = this.atrule;
      (prelude as SelectorList).children.each((node, item) => {
        const { children } = node as Selector;
        const pseudos: FlatPseudoSelectorList = [];
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
function filterByMqs(selectors: FlatSelectorList) {
  return selectors.filter(({ atrule }) => {
    if (atrule === null) {
      return ~useMqs.indexOf('');
    }
    // @ts-ignore
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
function filterByPseudos(selectors: FlatSelectorList) {
  return selectors.filter(
    ({ pseudos }) =>
      ~usePseudos.indexOf(
        csstree.generate({
          type: 'Selector',
          children: new List<CssNode>().fromArray(
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
function cleanPseudos(selectors: FlatSelectorList) {
  selectors.forEach(({ pseudos }) =>
    pseudos.forEach(pseudo => pseudo.list.remove(pseudo.item)),
  );
}

type Specificity = [number, number, number];
function specificity(selector: Selector): Specificity {
  let A = 0;
  let B = 0;
  let C = 0;

  selector.children.each(function walk(node: CssNode) {
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
            const children = (node as PseudoClassSelector).children;
            children && children.each(walk);
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
function compareSpecificity(
  aSpecificity: Specificity,
  bSpecificity: Specificity,
) {
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
function bySelectorSpecificity(
  selectorA: FlatSelector,
  selectorB: FlatSelector,
) {
  const aSpecificity = specificity(selectorA.item.data as Selector),
    bSpecificity = specificity(selectorB.item.data as Selector);
  return compareSpecificity(aSpecificity, bSpecificity);
}

/**
 * Sort selectors stably by their specificity.
 *
 * @param {Array} selectors to be sorted
 * @return {Array} Stable sorted selectors
 */
function sortSelectors(selectors: FlatSelectorList) {
  return stable(selectors, bySelectorSpecificity);
}

const declarationParseProps = {
  context: 'declarationList',
  parseValue: false,
};
function CSSStyleDeclaration(ast: AST) {
  const { props, styles } = ast;
  if (!props.style) {
    props.style = {};
  }
  const style = props.style as Styles;
  const priority = new Map();
  ast.style = style;
  ast.priority = priority;
  if (!styles || styles.length === 0) {
    return;
  }
  try {
    const declarations = csstree.parse(
      styles,
      declarationParseProps,
    ) as DeclarationList;
    declarations.children.each(node => {
      try {
        const { property, value, important } = node as Declaration;
        const name = property.trim();
        priority.set(name, important);
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
}

interface StyledAST extends AST {
  style: Styles;
  priority: Map<string, boolean | undefined>;
}
function initStyle(selectedEl: AST): StyledAST {
  if (!selectedEl.style) {
    CSSStyleDeclaration(selectedEl);
  }
  return selectedEl as StyledAST;
}

/**
 * Find the closest ancestor of the current element.
 * @param node
 * @param elemName
 * @return {?Object}
 */
function closestElem(node: AST, elemName: string) {
  let elem: AST | null = node;
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
 * @author modified by: msand <msand@abo.fi>
 */
export function inlineStyles(document: AST) {
  // collect <style/>s
  const styleElements = querySelectorAll(document, 'style');

  //no <styles/>s, nothing to do
  if (styleElements.length === 0) {
    return document;
  }

  const selectors: FlatSelectorList = [];

  for (let element of styleElements) {
    const { children } = element;
    if (!children.length || closestElem(element, 'foreignObject')) {
      // skip empty <style/>s or <foreignObject> content.
      continue;
    }

    // collect <style/>s and their css ast
    try {
      const styleString = children.join('');
      flattenToSelectors(csstree.parse(styleString, parseProps), selectors);
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
      const matched = querySelectorAll(document, selectorStr).map(initStyle);
      if (matched.length === 0) {
        continue;
      }
      csstree.walk(rule, {
        visit: 'Declaration',
        enter(node: CssNode) {
          const { property, value, important } = node as Declaration;
          // existing inline styles have higher priority
          // no inline styles, external styles,                                    external styles used
          // inline styles,    external styles same   priority as inline styles,   inline   styles used
          // inline styles,    external styles higher priority than inline styles, external styles used
          const name = property.trim();
          const camel = camelCase(name);
          const val = csstree.generate(value).trim();
          for (let element of matched) {
            const { style, priority } = element;
            const current = priority.get(name);
            if (current === undefined || current < important) {
              priority.set(name, important as boolean);
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

export function SvgCss(props: XmlProps) {
  const { xml, override } = props;
  const ast = useMemo<AST | null>(
    () => (xml !== null ? parse(xml, inlineStyles) : null),
    [xml],
  );
  return <SvgAst ast={ast} override={override || props} />;
}

export function SvgCssUri(props: UriProps) {
  const { uri } = props;
  const [xml, setXml] = useState<string | null>(null);
  useEffect(() => {
    uri
      ? fetchText(uri)
          .then(setXml)
          .catch(err)
      : setXml(null);
  }, [uri]);
  return <SvgCss xml={xml} override={props} />;
}

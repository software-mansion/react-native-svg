/// <reference path="css.d.ts"/>

// We can't import from 'css' because it will add dependency to 'fs' module
// which is not available in React Native. Instead, import directly from
// 'css/lib/parse' and use scraped definition file 'css.d.ts' for it.

import parseCSS, {
  AtRule,
  Comment,
  Declaration,
  Stylesheet,
  ParserError,
  Rule,
} from 'css/lib/parse';
import { AST, camelCase } from '../xml';

function parserErrorToString(err: ParserError): string {
  return `${err.message}`;
}

function error(message: string) {
  throw new Error(
    `${message} (CSS). If this is valid SVG, it's probably a bug. Please raise an issue\n\n`,
  );
}

function selectorMatches(element: AST, selector: string): boolean {
  if (selector.length === 0) {
    return false;
  }

  if (selector.split(/\s+/).length > 1) {
    throw new Error(
      `CSS selectors containing spaces are not yet supported in SVG: "${selector}"`,
    );
  }

  if (selector[0] === '.') {
    // class selector
    const props: { class?: string } = element.props;
    if (props.class) {
      const target: string = selector.substring(1); // drop '.' prefix
      if (props.class.split(/\s+/).find((clazz: string) => clazz === target)) {
        return true;
      }
    }
  } else {
    // tag name selector
    if (element.tag === selector) {
      return true;
    }
  }

  return false;
}

function ruleMatches(element: AST, rule: Rule): boolean {
  if (rule.selectors) {
    for (let selector of rule.selectors) {
      if (selectorMatches(element, selector)) {
        return true;
      }
    }
  }
  return false;
}

// Returns array of elements from AST tree that match given Rule.
// Search is made recursively from given element.
function findMatchingElements(element: AST, rule: Rule): AST[] {
  let matching: AST[] = [];
  if (ruleMatches(element, rule)) {
    matching.push(element);
  }

  const children: (AST | string)[] = element.children as (AST | string)[];
  children.forEach(function(child: AST | string) {
    if (typeof child === 'object') {
      matching = matching.concat(findMatchingElements(child, rule));
    }
  });

  return matching;
}

function applyRule(element: AST, rule: Rule) {
  if (rule.declarations) {
    const props: { [x: string]: string | undefined } = element.props;
    rule.declarations.forEach(function(decl: Declaration) {
      if (decl.property) {
        props[camelCase(decl.property)] = decl.value;
      }
    });
  }
}

function parseStyleElement(code: string): Stylesheet {
  // code = `apasdfupsdfau sdfj sdfaklj f${code} sdf fsd;f sdf;`;
  const ss: Stylesheet = parseCSS(code, { silent: true }) as Stylesheet;
  if (
    ss.stylesheet &&
    ss.stylesheet.parsingErrors &&
    ss.stylesheet.parsingErrors.length > 0
  ) {
    const errors: string[] = ss.stylesheet.parsingErrors.map(
      parserErrorToString,
    );
    const msg: string = errors.join(', ');
    error(`Parsing error in SVG style element: ${msg}`);
  }
  return ss;
}

function applyStylesheet(ss: Stylesheet, root: AST) {
  if (ss.stylesheet) {
    ss.stylesheet.rules.forEach(function(item: Rule | Comment | AtRule) {
      if (item.type === 'rule') {
        const rule: Rule = item as Rule;
        findMatchingElements(root, rule).forEach(function(element: AST) {
          applyRule(element, rule);
        });
      }
    });
  }
}

// Finds and handles <style> elements recursively
export default function applyCss(root: AST) {
  function traverse(element: AST) {
    if (element.tag === 'style' && element.children.length > 0) {
      const stylesheet: Stylesheet = parseStyleElement(element
        .children[0] as string);
      applyStylesheet(stylesheet, root);
    }

    const children: (AST | string)[] = element.children as (AST | string)[];
    children.forEach(function(child: AST | string) {
      if (typeof child === 'object') {
        traverse(child);
      }
    });
  }

  traverse(root);
}

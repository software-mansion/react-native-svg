import type { ComponentType, ComponentProps } from 'react';
import * as React from 'react';
import { Component, useEffect, useMemo, useState } from 'react';
import type { SvgProps } from './elements/Svg';
import { tags } from './xmlTags';

function missingTag() {
  return null;
}

type Tag = ComponentType<ComponentProps<(typeof tags)[keyof typeof tags]>>;
export interface AST {
  tag: string;
  style?: Styles;
  styles?: string;
  priority?: Map<string, boolean | undefined>;
  parent: AST | null;
  children: (AST | string)[] | (JSX.Element | string)[];
  props: {
    [prop: string]: Styles | string | undefined;
  };
  Tag: Tag;
}

export interface XmlAST extends AST {
  children: (XmlAST | string)[];
  parent: XmlAST | null;
}

export interface JsxAST extends AST {
  children: (JSX.Element | string)[];
}

export type AdditionalProps = {
  onError?: (error: Error) => void;
  override?: object;
  onLoad?: () => void;
  fallback?: JSX.Element;
};

export type UriProps = SvgProps & { uri: string | null } & AdditionalProps;
export type UriState = { xml: string | null };

export type XmlProps = SvgProps & { xml: string | null } & AdditionalProps;
export type XmlState = { ast: JsxAST | null };

export type AstProps = SvgProps & { ast: JsxAST | null } & AdditionalProps;

export function SvgAst({ ast, override }: AstProps) {
  if (!ast) {
    return null;
  }
  const { props, children } = ast;

  const Svg = tags.svg;

  return (
    <Svg {...props} {...override}>
      {children}
    </Svg>
  );
}

const err = console.error.bind(console);

export function SvgXml(props: XmlProps) {
  const { onError = err, xml, override, fallback } = props;

  try {
    const ast = useMemo<JsxAST | null>(
      () => (xml !== null ? parse(xml) : null),
      [xml]
    );
    return <SvgAst ast={ast} override={override || props} />;
  } catch (error) {
    onError(error);
    return fallback ?? null;
  }
}

export async function fetchText(uri?: string) {
  if (!uri) {
    return null;
  }
  const response = await fetch(uri);
  if (response.ok || (response.status === 0 && uri.startsWith('file://'))) {
    return await response.text();
  }
  throw new Error(`Fetching ${uri} failed with status ${response.status}`);
}

export function SvgUri(props: UriProps) {
  const { onError = err, uri, onLoad, fallback } = props;
  const [xml, setXml] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  useEffect(() => {
    uri
      ? fetchText(uri)
          .then((data) => {
            setXml(data);
            isError && setIsError(false);
            onLoad?.();
          })
          .catch((e) => {
            onError(e);
            setIsError(true);
          })
      : setXml(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onError, uri, onLoad]);
  if (isError) {
    return fallback ?? null;
  }
  return <SvgXml xml={xml} override={props} fallback={fallback} />;
}

// Extending Component is required for Animated support.

export class SvgFromXml extends Component<XmlProps, XmlState> {
  state = { ast: null };
  componentDidMount() {
    this.parse(this.props.xml);
  }

  componentDidUpdate(prevProps: { xml: string | null }) {
    const { xml } = this.props;
    if (xml !== prevProps.xml) {
      this.parse(xml);
    }
  }

  parse(xml: string | null) {
    const { onError = err } = this.props;
    try {
      this.setState({ ast: xml ? parse(xml) : null });
    } catch (e) {
      const error = e as Error;
      onError({
        ...error,
        message: `[RNSVG] Couldn't parse SVG, reason: ${error.message}`,
      });
    }
  }

  render() {
    const {
      props,
      state: { ast },
    } = this;
    return <SvgAst ast={ast} override={props.override || props} />;
  }
}

export class SvgFromUri extends Component<UriProps, UriState> {
  state = { xml: null };
  componentDidMount() {
    this.fetch(this.props.uri);
  }

  componentDidUpdate(prevProps: { uri: string | null }) {
    const { uri } = this.props;
    if (uri !== prevProps.uri) {
      this.fetch(uri);
    }
  }

  async fetch(uri: string | null) {
    try {
      this.setState({ xml: uri ? await fetchText(uri) : null });
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    const {
      props,
      state: { xml },
    } = this;
    return <SvgFromXml xml={xml} override={props} onError={props.onError} />;
  }
}

const upperCase = (_match: string, letter: string) => letter.toUpperCase();

export const camelCase = (phrase: string) =>
  phrase.replace(/[:-]([a-z])/g, upperCase);

export type Styles = { [property: string]: string };

export function getStyle(string: string): Styles {
  const style: Styles = {};
  const declarations = string.split(';').filter((v) => v.trim());
  const { length } = declarations;
  for (let i = 0; i < length; i++) {
    const declaration = declarations[i];
    if (declaration.length !== 0) {
      const split = declaration.split(':');
      const property = split[0];
      const value = split[1];
      style[camelCase(property.trim())] = value.trim();
    }
  }
  return style;
}

export function astToReact(
  value: AST | string,
  index: number
): JSX.Element | string {
  if (typeof value === 'object') {
    const { Tag, props, children } = value;
    if (props?.class) {
      props.className = props.class;
      delete props.class;
    }

    return (
      <Tag key={index} {...props}>
        {(children as (AST | string)[]).map(astToReact)}
      </Tag>
    );
  }
  return value;
}

// slimmed down parser based on https://github.com/Rich-Harris/svg-parser

function repeat(str: string, i: number) {
  let result = '';
  while (i--) {
    result += str;
  }
  return result;
}

const toSpaces = (tabs: string) => repeat('  ', tabs.length);

function locate(source: string, i: number) {
  const lines = source.split('\n');
  const nLines = lines.length;
  let column = i;
  let line = 0;
  for (; line < nLines; line++) {
    const { length } = lines[line];
    if (column >= length) {
      column -= length;
    } else {
      break;
    }
  }
  const before = source.slice(0, i).replace(/^\t+/, toSpaces);
  const beforeExec = /(^|\n).*$/.exec(before);
  const beforeLine = (beforeExec && beforeExec[0]) || '';
  const after = source.slice(i);
  const afterExec = /.*(\n|$)/.exec(after);
  const afterLine = afterExec && afterExec[0];
  const pad = repeat(' ', beforeLine.length);
  const snippet = `${beforeLine}${afterLine}\n${pad}^`;
  return { line, column, snippet };
}

const validNameCharacters = /[a-zA-Z0-9:_-]/;
const commentStart = /<!--/;
const whitespace = /[\s\t\r\n]/;
const quotemarks = /['"]/;

export type Middleware = (ast: XmlAST) => XmlAST;

export function parse(source: string, middleware?: Middleware): JsxAST | null {
  const length = source.length;
  let currentElement: XmlAST | null = null;
  let state = metadata;
  let children = null;
  let root: XmlAST | undefined;
  const stack: XmlAST[] = [];

  function error(message: string) {
    const { line, column, snippet } = locate(source, i);
    throw new Error(
      `${message} (${line}:${column}). If this is valid SVG, it's probably a bug. Please raise an issue\n\n${snippet}`
    );
  }

  function metadata() {
    while (
      i + 1 < length &&
      (source[i] !== '<' ||
        !(
          validNameCharacters.test(source[i + 1]) ||
          commentStart.test(source.slice(i, i + 4))
        ))
    ) {
      i++;
    }

    return neutral();
  }

  function neutral() {
    let text = '';
    let char;
    while (i < length && (char = source[i]) !== '<') {
      text += char;
      i += 1;
    }

    if (/\S/.test(text)) {
      children.push(text);
    }

    if (source[i] === '<') {
      return openingTag;
    }

    return neutral;
  }

  function openingTag() {
    const char = source[i];

    if (char === '?') {
      return neutral;
    } // <?xml...

    if (char === '!') {
      const start = i + 1;
      if (source.slice(start, i + 3) === '--') {
        return comment;
      }
      const end = i + 8;
      if (source.slice(start, end) === '[CDATA[') {
        return cdata;
      }
      if (/doctype/i.test(source.slice(start, end))) {
        return neutral;
      }
    }

    if (char === '/') {
      return closingTag;
    }

    const tag = getName() as keyof typeof tags;
    const props: { [prop: string]: Styles | string | undefined } = {};
    const element: XmlAST = {
      tag,
      props,
      children: [],
      parent: currentElement,
      Tag: (tags[tag] || missingTag) as Tag,
    };

    if (currentElement) {
      children.push(element);
    } else {
      root = element;
    }

    getAttributes(props);

    const { style } = props;
    if (typeof style === 'string') {
      element.styles = style;
      props.style = getStyle(style);
    }

    let selfClosing = false;

    if (source[i] === '/') {
      i += 1;
      selfClosing = true;
    }

    if (source[i] !== '>') {
      error('Expected >');
    }

    if (!selfClosing) {
      currentElement = element;
      ({ children } = element);
      stack.push(element);
    }

    return neutral;
  }

  function comment() {
    const index = source.indexOf('-->', i);
    if (!~index) {
      error('expected -->');
    }

    i = index + 2;
    return neutral;
  }

  function cdata() {
    const index = source.indexOf(']]>', i);
    if (!~index) {
      error('expected ]]>');
    }

    children.push(source.slice(i + 7, index));

    i = index + 2;
    return neutral;
  }

  function closingTag() {
    const tag = getName();

    if (!tag) {
      error('Expected tag name');
    }

    if (currentElement && tag !== currentElement.tag) {
      error(
        `Expected closing tag </${tag}> to match opening tag <${currentElement.tag}>`
      );
    }

    allowSpaces();
    if (source[i] !== '>') {
      error('Expected >');
    }

    stack.pop();
    currentElement = stack[stack.length - 1];
    if (currentElement) {
      ({ children } = currentElement);
    }

    return neutral;
  }

  function getName() {
    let name = '';
    let char;
    while (i < length && validNameCharacters.test((char = source[i]))) {
      name += char;
      i += 1;
    }

    return name;
  }

  function getAttributes(props: {
    [x: string]: Styles | string | number | boolean | undefined;
    style?: string | Styles | undefined;
  }) {
    while (i < length) {
      if (!whitespace.test(source[i])) {
        return;
      }
      allowSpaces();

      const name = getName();
      if (!name) {
        return;
      }

      let value: boolean | number | string = true;

      allowSpaces();
      if (source[i] === '=') {
        i += 1;
        allowSpaces();

        value = getAttributeValue();
        if (!isNaN(+value) && value.trim() !== '') {
          value = +value;
        }
      }

      props[camelCase(name)] = value;
    }
  }

  function getAttributeValue(): string {
    return quotemarks.test(source[i])
      ? getQuotedAttributeValue()
      : getUnquotedAttributeValue();
  }

  function getUnquotedAttributeValue() {
    let value = '';
    do {
      const char = source[i];
      if (char === ' ' || char === '>' || char === '/') {
        return value;
      }

      value += char;
      i += 1;
    } while (i < length);

    return value;
  }

  function getQuotedAttributeValue() {
    const quotemark = source[i++];

    let value = '';
    let escaped = false;

    while (i < length) {
      const char = source[i++];
      if (char === quotemark && !escaped) {
        return value;
      }

      if (char === '\\' && !escaped) {
        escaped = true;
      }

      value += escaped ? `\\${char}` : char;
      escaped = false;
    }

    return value;
  }

  function allowSpaces() {
    while (i < length && whitespace.test(source[i])) {
      i += 1;
    }
  }

  let i = 0;
  while (i < length) {
    if (!state) {
      error('Unexpected character');
    }
    state = state();
    i += 1;
  }

  if (state !== neutral) {
    error('Unexpected end of input');
  }

  if (root) {
    const xml: XmlAST = (middleware ? middleware(root) : root) || root;
    const ast: (JSX.Element | string)[] = xml.children.map(astToReact);
    const jsx: JsxAST = xml as JsxAST;
    jsx.children = ast;
    return jsx;
  }

  return null;
}
export { tags };

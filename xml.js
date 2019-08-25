import React, { Component, useState, useEffect, useMemo } from "react";
import Rect from './elements/Rect';
import Circle from './elements/Circle';
import Ellipse from './elements/Ellipse';
import Polygon from './elements/Polygon';
import Polyline from './elements/Polyline';
import Line from './elements/Line';
import Svg from './elements/Svg';
import Path from './elements/Path';
import G from './elements/G';
import Text from './elements/Text';
import TSpan from './elements/TSpan';
import TextPath from './elements/TextPath';
import Use from './elements/Use';
import Image from './elements/Image';
import Symbol from './elements/Symbol';
import Defs from './elements/Defs';
import LinearGradient from './elements/LinearGradient';
import RadialGradient from './elements/RadialGradient';
import Stop from './elements/Stop';
import ClipPath from './elements/ClipPath';
import Pattern from './elements/Pattern';
import Mask from './elements/Mask';

export const tags = {
  svg: Svg,
  circle: Circle,
  ellipse: Ellipse,
  g: G,
  text: Text,
  tspan: TSpan,
  textPath: TextPath,
  path: Path,
  polygon: Polygon,
  polyline: Polyline,
  line: Line,
  rect: Rect,
  use: Use,
  image: Image,
  symbol: Symbol,
  defs: Defs,
  linearGradient: LinearGradient,
  radialGradient: RadialGradient,
  stop: Stop,
  clipPath: ClipPath,
  pattern: Pattern,
  mask: Mask
};

export function SvgAst({ ast, override }) {
  const { props, children } = ast;
  return (
    <Svg {...props} {...override}>
      {children}
    </Svg>
  );
}

export function SvgXml({ xml, ...props }) {
  const ast = useMemo(() => xml && parse(xml), [xml]);
  return (ast && <SvgAst ast={ast} override={props} />) || null;
}

async function fetchText(uri) {
  const response = await fetch(uri);
  return await response.text();
}

const err = console.error.bind(console);

export function SvgUri({ uri, ...props }) {
  const [xml, setXml] = useState();
  useEffect(() => {
    fetchText(uri)
      .then(setXml)
      .catch(err);
  }, [uri]);
  return (xml && <SvgXml xml={xml} {...props} />) || null;
}

// Extending Component is required for Animated support.

export class SvgFromXml extends Component {
  state = {};
  componentDidMount() {
    const { xml } = this.props;
    this.parse(xml);
  }
  componentDidUpdate(prevProps) {
    const { xml } = this.props;
    if (xml !== prevProps.xml) {
      this.parse(xml);
    }
  }
  parse(xml) {
    try {
      const ast = parse(xml);
      this.setState({ ast });
    } catch (e) {
      console.error(e);
    }
  }
  render() {
    const { ast } = this.state;
    return ast ? <SvgAst ast={ast} override={this.props} /> : null;
  }
}

export class SvgFromUri extends Component {
  state = {};
  componentDidMount() {
    const { uri } = this.props;
    this.fetch(uri);
  }
  componentDidUpdate(prevProps) {
    const { uri } = this.props;
    if (uri !== prevProps.uri) {
      this.fetch(uri);
    }
  }
  async fetch(uri) {
    try {
      const xml = await fetchText(uri);
      this.setState({ xml });
    } catch (e) {
      console.error(e);
    }
  }
  render() {
    const { xml } = this.state;
    return xml ? <SvgFromXml xml={xml} {...this.props} /> : null;
  }
}

const upperCase = (match, letter) => letter.toUpperCase();

const camelCase = phrase => phrase.replace(/-([a-z])/g, upperCase);

export function getStyle(string) {
  const style = {};
  const declarations = string.split(";");
  for (let i = 0, l = declarations.length; i < l; i++) {
    const declaration = declarations[i].split(":");
    const property = declaration[0];
    const value = declaration[1];
    style[camelCase(property.trim())] = value.trim();
  }
  return style;
}

export function astToReact(child, i) {
  if (typeof child === "object") {
    const { Tag, props, children } = child;
    return (
      <Tag key={i} {...props}>
        {children.map(astToReact)}
      </Tag>
    );
  }
  return child;
}

// slimmed down parser based on https://github.com/Rich-Harris/svg-parser

function locate(source, search) {
  const lines = source.split("\n");
  for (let line = 0, l = lines.length; line < l; line++) {
    const { length } = lines[line];
    if (search < length) {
      return { line, column: search };
    } else {
      search -= length;
    }
  }
}

const validNameCharacters = /[a-zA-Z0-9:_-]/;
const whitespace = /[\s\t\r\n]/;
const quotemark = /['"]/;

function repeat(str, i) {
  let result = "";
  while (i--) result += str;
  return result;
}

export function parse(source) {
  const length = source.length;
  let currentElement = null;
  let state = metadata;
  let children = null;
  let root = null;
  let stack = [];

  function error(message) {
    const { line, column } = locate(source, i);
    const before = source
      .slice(0, i)
      .replace(/^\t+/, match => repeat("  ", match.length));
    const beforeLine = /(^|\n).*$/.exec(before)[0];
    const after = source.slice(i);
    const afterLine = /.*(\n|$)/.exec(after)[0];

    const snippet = `${beforeLine}${afterLine}\n${repeat(
      " ",
      beforeLine.length
    )}^`;

    throw new Error(
      `${message} (${line}:${column}). If this is valid SVG, it's probably a bug. Please raise an issue\n\n${snippet}`
    );
  }

  function metadata() {
    while (
      (i < length && source[i] !== "<") ||
      !validNameCharacters.test(source[i + 1])
      ) {
      i++;
    }

    return neutral();
  }

  function neutral() {
    let text = "";
    while (i < length && source[i] !== "<") text += source[i++];

    if (/\S/.test(text)) {
      children.push(text);
    }

    if (source[i] === "<") {
      return openingTag;
    }

    return neutral;
  }

  function openingTag() {
    const char = source[i];

    if (char === "?") return neutral; // <?xml...

    if (char === "!") {
      if (source.slice(i + 1, i + 3) === "--") return comment;
      if (source.slice(i + 1, i + 8) === "[CDATA[") return cdata;
      if (/doctype/i.test(source.slice(i + 1, i + 8))) return neutral;
    }

    if (char === "/") return closingTag;

    const tag = getName();
    const props = {};
    const element = {
      tag,
      props,
      children: [],
      Tag: tags[tag]
    };

    if (currentElement) {
      children.push(element);
    } else {
      root = element;
    }

    getAttributes(props);

    const { style } = props;
    if (style) {
      props.style = getStyle(style);
    }

    let selfClosing = false;

    if (source[i] === "/") {
      i += 1;
      selfClosing = true;
    }

    if (source[i] !== ">") {
      error("Expected >");
    }

    if (!selfClosing) {
      currentElement = element;
      ({ children } = element);
      stack.push(element);
    }

    return neutral;
  }

  function comment() {
    const index = source.indexOf("-->", i);
    if (!~index) error("expected -->");

    i = index + 2;
    return neutral;
  }

  function cdata() {
    const index = source.indexOf("]]>", i);
    if (!~index) error("expected ]]>");

    i = index + 2;
    return neutral;
  }

  function closingTag() {
    const tag = getName();

    if (!tag) error("Expected tag name");

    if (tag !== currentElement.tag) {
      error(
        `Expected closing tag </${tag}> to match opening tag <${
          currentElement.tag
          }>`
      );
    }

    if (source[i] !== ">") {
      error("Expected >");
    }

    stack.pop();
    currentElement = stack[stack.length - 1];
    if (currentElement) {
      ({ children } = currentElement);
    }

    return neutral;
  }

  function getName() {
    let name = "";
    while (i < length && validNameCharacters.test(source[i]))
      name += source[i++];

    return name;
  }

  function getAttributes(props) {
    while (i < length) {
      if (!whitespace.test(source[i])) return;
      allowSpaces();

      const name = getName();
      if (!name) return;

      let value = true;

      allowSpaces();
      if (source[i] === "=") {
        i += 1;
        allowSpaces();

        value = getAttributeValue();
        if (!isNaN(value) && value.trim() !== "") value = +value;
      }

      props[camelCase(name)] = value;
    }
  }

  function getAttributeValue() {
    return quotemark.test(source[i])
      ? getQuotedAttributeValue()
      : getUnquotedAttributeValue();
  }

  function getUnquotedAttributeValue() {
    let value = "";
    do {
      const char = source[i];
      if (char === " " || char === ">" || char === "/") {
        return value;
      }

      value += char;
      i += 1;
    } while (i < length);

    return value;
  }

  function getQuotedAttributeValue() {
    const quotemark = source[i++];

    let value = "";
    let escaped = false;

    while (i < length) {
      const char = source[i++];
      if (char === quotemark && !escaped) {
        return value;
      }

      if (char === "\\" && !escaped) {
        escaped = true;
      }

      value += escaped ? `\\${char}` : char;
      escaped = false;
    }
  }

  function allowSpaces() {
    while (i < length && whitespace.test(source[i])) i += 1;
  }

  let i = 0;
  while (i < length) {
    if (!state) error("Unexpected character");
    state = state();
    i += 1;
  }

  if (state !== neutral) {
    error("Unexpected end of input");
  }

  root.children = root.children.map(astToReact);

  return root;
}

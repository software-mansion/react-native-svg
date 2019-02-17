import React, { Children } from 'react';
import extractLengthList from './extractLengthList';
import { pickNotNil } from '../util';

const fontRegExp = /^\s*((?:(?:normal|bold|italic)\s+)*)(?:(\d+(?:\.\d+)?[ptexm%])*(?:\s*\/.*?)?\s+)?\s*"?([^"]*)/i;
const fontFamilyPrefix = /^[\s"']*/;
const fontFamilySuffix = /[\s"']*$/;
const commaReg = /\s*,\s*/g;

const cachedFontObjectsFromString = {};

function extractSingleFontFamily(fontFamilyString) {
  // SVG on the web allows for multiple font-families to be specified.
  // For compatibility, we extract the first font-family, hoping
  // we'll get a match.
  return fontFamilyString
    ? fontFamilyString
        .split(commaReg)[0]
        .replace(fontFamilyPrefix, '')
        .replace(fontFamilySuffix, '')
    : null;
}

function parseFontString(font) {
  if (cachedFontObjectsFromString.hasOwnProperty(font)) {
    return cachedFontObjectsFromString[font];
  }
  const match = fontRegExp.exec(font);
  if (!match) {
    cachedFontObjectsFromString[font] = null;
    return null;
  }
  const isBold = /bold/.exec(match[1]);
  const isItalic = /italic/.exec(match[1]);
  cachedFontObjectsFromString[font] = {
    fontSize: match[2] || 12,
    fontWeight: isBold ? 'bold' : 'normal',
    fontStyle: isItalic ? 'italic' : 'normal',
    fontFamily: extractSingleFontFamily(match[3]),
  };
  return cachedFontObjectsFromString[font];
}

export function extractFont(props) {
  const {
    fontData,
    fontStyle,
    fontVariant,
    fontWeight,
    fontStretch,
    fontSize,
    fontFamily,
    textAnchor,
    textDecoration,
    letterSpacing,
    wordSpacing,
    kerning,
    fontVariantLigatures,
    fontFeatureSettings,
    font,
  } = props;

  const ownedFont = pickNotNil({
    fontData,
    fontStyle,
    fontVariant,
    fontWeight,
    fontStretch,
    fontSize,
    fontFamily: extractSingleFontFamily(fontFamily),
    textAnchor,
    textDecoration,
    letterSpacing,
    wordSpacing,
    kerning,
    fontVariantLigatures,
    fontFeatureSettings,
  });

  const baseFont = typeof font === 'string' ? parseFontString(font) : font;

  return { ...baseFont, ...ownedFont };
}

let TSpan;

export function setTSpan(TSpanImplementation) {
  TSpan = TSpanImplementation;
}

function getChild(child) {
  if (typeof child === 'string' || typeof child === 'number') {
    return <TSpan>{String(child)}</TSpan>;
  } else {
    return child;
  }
}

export default function extractText(props, container) {
  const {
    x,
    y,
    dx,
    dy,
    rotate,
    children,
    baselineShift,
    verticalAlign,
    alignmentBaseline,
  } = props;

  const textChildren =
    typeof children === 'string' || typeof children === 'number' ? (
      container ? (
        <TSpan>{String(children)}</TSpan>
      ) : null
    ) : Children.count(children) > 1 || Array.isArray(children) ? (
      Children.map(children, getChild)
    ) : (
      children
    );

  return {
    content: textChildren === null ? String(children) : null,
    children: textChildren,
    baselineShift,
    verticalAlign,
    alignmentBaseline,
    font: extractFont(props),
    x: extractLengthList(x),
    y: extractLengthList(y),
    dx: extractLengthList(dx),
    dy: extractLengthList(dy),
    rotate: extractLengthList(rotate),
  };
}

import type { ComponentType } from 'react';
import * as React from 'react';
import { Children } from 'react';
import extractLengthList from './extractLengthList';
import { pickNotNil } from '../util';
import type { NumberArray, NumberProp } from './types';

const fontRegExp =
  /^\s*((?:(?:normal|bold|italic)\s+)*)(?:(\d+(?:\.\d+)?(?:%|px|em|pt|pc|mm|cm|in]))*(?:\s*\/.*?)?\s+)?\s*"?([^"]*)/i;
const fontFamilyPrefix = /^[\s"']*/;
const fontFamilySuffix = /[\s"']*$/;
const commaReg = /\s*,\s*/g;

const cachedFontObjectsFromString: {
  [font: string]: {
    fontStyle: string;
    fontSize: NumberProp;
    fontWeight: NumberProp;
    fontFamily: string | null;
  } | null;
} = {};

function extractSingleFontFamily(fontFamilyString?: string) {
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

function parseFontString(font: string) {
  if (Object.prototype.hasOwnProperty.call(cachedFontObjectsFromString, font)) {
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

interface fontProps {
  fontData?: unknown;
  fontStyle?: string;
  fontVariant?: string;
  fontWeight?: NumberProp;
  fontStretch?: string;
  fontSize?: NumberProp;
  fontFamily?: string;
  textAnchor?: string;
  textDecoration?: string;
  letterSpacing?: NumberProp;
  wordSpacing?: NumberProp;
  kerning?: NumberProp;
  fontFeatureSettings?: string;
  fontVariantLigatures?: string;
  fontVariationSettings?: string;
  font?: string;
}

export function extractFont(props: fontProps) {
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
    fontFeatureSettings,
    fontVariantLigatures,
    fontVariationSettings,
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
    fontFeatureSettings,
    fontVariantLigatures,
    fontVariationSettings,
  });

  const baseFont = typeof font === 'string' ? parseFontString(font) : font;

  return { ...baseFont, ...ownedFont };
}

let TSpan: ComponentType<React.PropsWithChildren>;

export function setTSpan(TSpanImplementation: ComponentType) {
  TSpan = TSpanImplementation;
}

export type TextChild =
  | (undefined | string | number | ComponentType | React.ReactElement)
  | TextChild[];

function getChild(child: TextChild) {
  if (typeof child === 'string' || typeof child === 'number') {
    return <TSpan>{String(child)}</TSpan>;
  } else {
    return child;
  }
}

export type TextProps = {
  x?: NumberArray;
  y?: NumberArray;
  dx?: NumberArray;
  dy?: NumberArray;
  rotate?: NumberArray;
  children?: TextChild;
  inlineSize?: NumberProp;
  baselineShift?: NumberProp;
  verticalAlign?: NumberProp;
  alignmentBaseline?: string;
} & fontProps;

export default function extractText(props: TextProps, container: boolean) {
  const {
    x,
    y,
    dx,
    dy,
    rotate,
    children,
    inlineSize,
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
    inlineSize,
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

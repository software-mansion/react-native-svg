/**
 * MIT License
 *
 * Copyright (C) 2023 Huawei Device Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANT KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/** 0-1 */
export type NormalizedScalar = number

/** RGBA */
export type ColorSegments = [
  NormalizedScalar,
  NormalizedScalar,
  NormalizedScalar,
  NormalizedScalar
]

export type TransformMatrix = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number
];

export type SVGOffset = {
  x: string | number,
  y: string | number
}

export type SVGColorValue = {
  type: number,
  payload?: ColorSegments,
  brushRef?: string
}

export type SVGCommonProps = {
  name?: string,
  opacity?: number,
  matrix?: number[],
  mask?: string,
  markerStart?: string,
  markerMid?: string,
  markerEnd?: string,
  clipPath?: string,
  clipRule?: number,
  responsible?: boolean,
  display?: string,
  pointerEvents?: string
}

export type SVGBaseProps = SVGCommonProps & {
  fill?: SVGColorValue,
  fillOpacity?: number,
  fillRule?: number,
  stroke?: SVGColorValue,
  strokeOpacity?: number,
  strokeWidth?: string,
  strokeLinecap?: number,
  strokeLinejoin?: number,
  strokeDasharray?: string[],
  strokeDashoffset?: number,
  strokeMiterlimit?: number,
  vectorEffect?: number,
  propList?: string[]
}

export type SVGViewProps = {
  bbWidth?: string,
  bbHeight?: string,
  minX: number,
  minY: number,
  vbWidth: number,
  vbHeight: number,
  align?: string,
  meetOrSlice?: number,
  tintColor?: ColorSegments,
  color?: ColorSegments,
  pointerEvents?: number
}

export type SVGGroupProps = SVGBaseProps & {
  fontSize?: string,
  fontWeight?: string,
  font: object
}

export type SVGDefsProps = SVGBaseProps & {
  x?: string,
  y?: string,
  width?: string,
  height?: string,
  src: string,
  align?: string,
  meetOrSlice?: number
}

export type SVGClipPathProps = SVGBaseProps & {
  fontSize?: string,
  fontWeight?: string,
  font: object
}

export type SVGImageProps = SVGBaseProps & {
  x?: string,
  y?: string,
  width?: string,
  height?: string,
  src: string,
  align?: string,
  meetOrSlice?: number
}

export type SVGPathProps = SVGBaseProps & {
  d: string
}

export type SVGRectProps = SVGBaseProps & {
  x?: string,
  y?: string,
  width?: string,
  height?: string,
  rx?: string,
  ry?: string
}

/** Text 部分 */
export type NumberProp = string | number;

export type TextAnchor = 'start' | 'middle' | 'end';

export type FontStyle = 'normal' | 'italic' | 'oblique';

export type FontVariant = 'normal' | 'small-caps';

export type FontWeight =
| NumberProp
  | 'normal'
  | 'bold'
  | 'bolder'
  | 'lighter'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900';

export type FontStretch =
| 'normal'
  | 'wider'
  | 'narrower'
  | 'ultra-condensed'
  | 'extra-condensed'
  | 'condensed'
  | 'semi-condensed'
  | 'semi-expanded'
  | 'expanded'
  | 'extra-expanded'
  | 'ultra-expanded';

export type TextDecoration =
| 'none'
  | 'underline'
  | 'overline'
  | 'line-through'
  | 'blink';

export type FontVariantLigatures = 'normal' | 'none';

export type SVGFontProps = {
  fontStyle?: FontStyle;
  fontVariant?: FontVariant;
  fontWeight?: FontWeight;
  fontStretch?: FontStretch;
  fontSize?: NumberProp;
  fontFamily?: string;
  textAnchor?: TextAnchor;
  textDecoration?: TextDecoration;
  letterSpacing?: NumberProp;
  wordSpacing?: NumberProp;
  kerning?: NumberProp;
  fontFeatureSettings?: string;
  fontVariantLigatures?: FontVariantLigatures;
  fontVariationSettings?: string;
}

export type SVGTextProps = SVGBaseProps & {
  fontSize?: string,
  fontWeight?: string,
  font?: SVGFontProps,
  dx?: string[],
  dy?: string[],
  x?: string[],
  y?: string[],
  rotate?: string[],
  inlineSize?: string,
  textLength?: string,
  baselineShift?: string,
  lengthAdjust?: string,
  alignmentBaseline?: string,
  verticalAlign?: string
}

export type SVGTSpanProps = SVGTextProps & {
  content?: string
}

export type SVGLinearGradientProps = SVGCommonProps & {
  x1?: string,
  y1?: string,
  x2?: string,
  y2?: string,
  gradient: string,
  gradientUnits: number,
  gradientTransform: object
}

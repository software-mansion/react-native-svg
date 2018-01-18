import * as React from 'react';
import * as ReactNative from 'react-native';

// Common props
type NumberProp = string | number;

export type FillRule = 'evenodd' | 'nonzero';
export type Units = 'userSpaceOnUse' | 'objectBoundingBox';
export type TextAnchor = 'start' | 'middle' | 'end';
export type Linecap = 'butt' | 'square' | 'round';
export type Linejoin = 'miter' | 'bevel' | 'round';

export interface TouchableProps {
  disabled?: boolean,
  onPress?: (event: any) => any,
  onPressIn?: (event: any) => any,
  onPressOut?: (event: any) => any,
  onLongPress?: (event: any) => any,
  delayPressIn?: number,
  delayPressOut?: number,
  delayLongPress?: number
}

export interface ResponderProps extends ReactNative.GestureResponderHandlers {
  pointerEvents?: (event: any) => any,
}

export interface FillProps {
  fill?: string,
  fillOpacity?: NumberProp,
  fillRule?: FillRule,
}

export interface ClipProps {
  clipRule?: FillRule,
  clipPath?: string
}

export interface DefinitionProps {
  name?: string,
}

export interface StrokeProps {
  stroke?: string,
  strokeWidth?: NumberProp,
  strokeOpacity?: NumberProp,
  strokeDasharray?: number[] | string,
  strokeDashoffset?: NumberProp,
  strokeLinecap?: Linecap,
  strokeLinejoin?: Linejoin,
  strokeMiterlimit?: NumberProp,
}

export interface FontProps {
  fontFamily?: string,
  fontSize?: NumberProp,
  fontWeight?: NumberProp,
  fontStyle?: string,
  font?: object
}

export interface TransformObject {
  scale?: NumberProp,
  scaleX?: NumberProp,
  scaleY?: NumberProp,
  rotate?: NumberProp,
  rotation?: NumberProp,
  translate?: NumberProp,
  translateX?: NumberProp,
  translateY?: NumberProp,
  x?: NumberProp,
  y?: NumberProp,
  origin?: NumberProp,
  originX?: NumberProp,
  originY?: NumberProp,
  skew?: NumberProp,
  skewX?: NumberProp,
  skewY?: NumberProp,
}

export interface TransformProps extends TransformObject {
  transform?: string | TransformObject,
}

export interface CommonPathProps extends FillProps, StrokeProps, ClipProps, TransformProps, ResponderProps, TouchableProps, DefinitionProps {}


// Element props
export interface CircleProps extends CommonPathProps {
  cx?: NumberProp,
  cy?: NumberProp,
  r?: NumberProp,
}
export const Circle: React.ComponentClass<CircleProps>;

export interface ClipPathProps {
  id: string,
}
export const ClipPath: React.ComponentClass<ClipPathProps>;

export const Defs: React.ComponentClass<{}>;

export interface EllipseProps extends CommonPathProps {
  cx?: NumberProp,
  cy?: NumberProp,
  rx?: NumberProp,
  ry?: NumberProp,
}
export const Ellipse: React.ComponentClass<EllipseProps>;

export interface GProps extends CommonPathProps {
}
export const G: React.ComponentClass<GProps>;

export type ImageHref = ReactNative.ImageURISource | ReactNative.ImageURISource[] | ReactNative.ImageRequireSource;

export interface ImageProps extends ResponderProps, TouchableProps {
  x?: NumberProp,
  y?: NumberProp,
  width?: NumberProp,
  height?: NumberProp,
  href: ImageHref,
  preserveAspectRatio?: string,
}
export const Image: React.ComponentClass<ImageProps>;

export interface LineProps extends CommonPathProps {
  x1?: NumberProp,
  x2?: NumberProp,
  y1?: NumberProp,
  y2?: NumberProp,
}
export const Line: React.ComponentClass<LineProps>;

export interface LinearGradientProps {
  x1?: NumberProp,
  x2?: NumberProp,
  y1?: NumberProp,
  y2?: NumberProp,
  gradientUnits?: Units,
  id: string,
}
export const LinearGradient: React.ComponentClass<LinearGradientProps>;

export interface PathProps extends CommonPathProps {
  d: string,
}
export const Path: React.ComponentClass<PathProps>;

export interface PatternProps {
  x1?: NumberProp,
  x2?: NumberProp,
  y1?: NumberProp,
  y2?: NumberProp,
  patternTransform?: string,
  patternUnits?: Units,
  patternContentUnits?: Units,
}
export const Pattern: React.ComponentClass<PatternProps>;

export interface PolygonProps extends CommonPathProps {
  points: string | any[],
}
export const Polygon: React.ComponentClass<PolygonProps>;

export interface PolylineProps extends CommonPathProps {
  points: string | any[],
}
export const Polyline: React.ComponentClass<PolylineProps>;

export interface RadialGradientProps {
  fx?: NumberProp,
  fy?: NumberProp,
  rx?: NumberProp,
  ry?: NumberProp,
  cx?: NumberProp,
  cy?: NumberProp,
  r?: NumberProp,
  gradientUnits?: Units,
  id: string,
}
export const RadialGradient: React.ComponentClass<RadialGradientProps>;

export interface RectProps extends CommonPathProps {
  x?: NumberProp,
  y?: NumberProp,
  width?: NumberProp,
  height?: NumberProp,
  rx?: NumberProp,
  ry?: NumberProp,
  class?: string,
}
export const Rect: React.ComponentClass<RectProps>;

export interface ShapeProps {
}
export const Shape: React.ComponentClass<ShapeProps>;

export interface StopProps {
  stopColor?: string,
  stopOpacity?: NumberProp,
  offset?: string,
}
export const Stop: React.ComponentClass<StopProps>;

export interface SvgProps extends ReactNative.ViewProperties {
  opacity?: NumberProp,
  width?: NumberProp,
  height?: NumberProp,
  viewBox?: string,
  preserveAspectRatio?: string,
}

// Svg is both regular and default exported
export const Svg: React.ComponentClass<SvgProps>;
export default Svg;

export interface SymbolsProps {
  id: string,
  viewBox?: string,
  preserveAspectRatio?: string,
}
export const Symbols: React.ComponentClass<SymbolsProps>;

export interface TSpanProps extends CommonPathProps, FontProps {
  dx?: NumberProp,
  dy?: NumberProp,
  textAnchor?: TextAnchor,
}
export const TSpan: React.ComponentClass<TSpanProps>;

export interface TextProps extends CommonPathProps, FontProps {
  dx?: NumberProp,
  dy?: NumberProp,
  textAnchor?: TextAnchor,
}
export const Text: React.ComponentClass<TextProps>;

export interface TextPathProps extends CommonPathProps, FontProps {
  href: string,
  startOffset?: NumberProp,
}
export const TextPath: React.ComponentClass<TextPathProps>;

export interface UseProps extends CommonPathProps {
  href: string,
  width?: NumberProp,
  height?: NumberProp,
}
export const Use: React.ComponentClass<UseProps>;

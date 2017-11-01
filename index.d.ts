import * as React from 'react';
import * as ReactNative from 'react-native';

// Common props
type NumberProp = string | number;

interface TouchableProps {
  disabled?: boolean,
  onPress?: (event: any) => any,
  onPressIn?: (event: any) => any,
  onPressOut?: (event: any) => any,
  onLongPress?: (event: any) => any,
  delayPressIn?: number,
  delayPressOut?: number,
  delayLongPress?: number
}

interface ResponderProps extends ReactNative.GestureResponderHandlers {
  pointerEvents?: (event: any) => any,
}

interface FillProps {
  fill?: string,
  fillOpacity?: NumberProp,
  fillRule?: 'evenodd' | 'nonzero',
}

interface ClipProps {
  clipRule?: 'evenodd' | 'nonzero',
  clipPath?: string
}

interface DefinationProps {
  name?: string,
}

interface StrokeProps {
  stroke?: string,
  strokeWidth?: NumberProp,
  strokeOpacity?: NumberProp,
  strokeDasharray?: number[] | string,
  strokeDashoffset?: NumberProp,
  strokeLinecap?: 'butt' | 'square' | 'round',
  strokeLinejoin?: 'miter' | 'bevel' | 'round',
  strokeMiterlimit?: NumberProp,
}

interface FontProps {
  fontFamily?: string,
  fontSize?: NumberProp,
  fontWeight?: NumberProp,
  fontStyle?: string,
  font?: object
}

interface TransformProps {
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
  transform?: object,
}

interface PathProps extends FillProps, StrokeProps, ClipProps, TransformProps, ResponderProps, TouchableProps, DefinationProps {}


// Element props
interface CircleProps extends PathProps {
  cx?: NumberProp,
  cy?: NumberProp,
  r?: NumberProp,
}
export const Circle: React.ComponentClass<CircleProps>;

interface ClipPathProps {
  id: string,
}
export const ClipPath: React.ComponentClass<ClipPathProps>;

export const Defs: React.ComponentClass<{}>;

interface EllipseProps extends PathProps {
  cx?: NumberProp,
  cy?: NumberProp,
  rx?: NumberProp,
  ry?: NumberProp,
}
export const Ellipse: React.ComponentClass<EllipseProps>;

export const G: React.ComponentClass<PathProps>;

interface ImageProps extends ResponderProps, TouchableProps {
  x?: NumberProp,
  y?: NumberProp,
  width?: NumberProp,
  height?: NumberProp,
  href: ReactNative.ImageURISource | ReactNative.ImageURISource[] | ReactNative.ImageRequireSource,
  preserveAspectRatio?: string,
}
export const Image: React.ComponentClass<ImageProps>;

interface LineProps extends PathProps {
  x1?: NumberProp,
  x2?: NumberProp,
  y1?: NumberProp,
  y2?: NumberProp,
}
export const Line: React.ComponentClass<LineProps>;

interface LinearGradientProps {
  x1?: NumberProp,
  x2?: NumberProp,
  y1?: NumberProp,
  y2?: NumberProp,
  gradientUnits?: 'objectBoundingBox' | 'userSpaceOnUse',
  id: string,
}
export const LinearGradient: React.ComponentClass<LinearGradientProps>;

interface PathElementProps extends PathProps {
  d: string,
}
export const Path: React.ComponentClass<PathElementProps>;

interface PatternProps {
  x1?: NumberProp,
  x2?: NumberProp,
  y1?: NumberProp,
  y2?: NumberProp,
  patternTransform?: string,
  patternUnits?: 'userSpaceOnUse' | 'objectBoundingBox',
  patternContentUnits?: 'userSpaceOnUse' | 'objectBoundingBox',
}
export const Pattern: React.ComponentClass<PatternProps>;

interface PolygonProps extends PathProps {
  points: string | any[],
}
export const Polygon: React.ComponentClass<PolygonProps>;

interface PolylineProps extends PathProps {
  points: string | any[],
}
export const Polyline: React.ComponentClass<PolylineProps>;

interface RadialGradientProps {
  fx?: NumberProp,
  fy?: NumberProp,
  rx?: NumberProp,
  ry?: NumberProp,
  cx?: NumberProp,
  cy?: NumberProp,
  r?: NumberProp,
  gradientUnits: 'objectBoundingBox' | 'userSpaceOnUse',
  id: string,
}
export const RadialGradient: React.ComponentClass<RadialGradientProps>;

interface RectProps extends PathProps {
  x?: NumberProp,
  y?: NumberProp,
  width?: NumberProp,
  height?: NumberProp,
  rx?: NumberProp,
  ry?: NumberProp,
}
export const Rect: React.ComponentClass<RectProps>;

export const Shape: React.ComponentClass<{}>;

interface StopProps {
  stopColor?: string,
  stopOpacity?: NumberProp,
}
export const Stop: React.ComponentClass<StopProps>;

interface SvgProps extends ReactNative.ViewProperties {
  opacity?: NumberProp,
  width?: NumberProp,
  height?: NumberProp,
  viewBox?: string,
  preserveAspectRatio?: string
}

declare const Svg: React.ComponentClass<SvgProps>;
export default Svg;

interface SymbolsProps {
  id: string,
  viewBox?: string,
  preserveAspectRatio?: string,
}
export const Symbols: React.ComponentClass<SymbolsProps>;

interface TSpanProps extends PathProps, FontProps {
  dx?: NumberProp,
  dy?: NumberProp,
  textAnchor?: 'start' | 'middle' | 'end',
}
export const TSpan: React.ComponentClass<TSpanProps>;

interface TextProps extends PathProps, FontProps {
  dx?: NumberProp,
  dy?: NumberProp,
  textAnchor?: 'start' | 'middle' | 'end',
}
export const Text: React.ComponentClass<TextProps>;

interface TextPathProps extends PathProps, FontProps {
  href: string,
  startOffset?: NumberProp,
}
export const TextPath: React.ComponentClass<TextPathProps>;

interface UseProps extends PathProps {
  href: string,
  width?: NumberProp,
  height?: NumberProp,
}
export const Use: React.ComponentClass<UseProps>;

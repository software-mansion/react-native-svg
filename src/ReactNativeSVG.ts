import { tags } from './tags';
import Shape from './elements/Shape';

import {
  parse,
  SvgAst,
  SvgFromUri,
  SvgFromXml,
  SvgUri,
  SvgXml,
  camelCase,
  fetchText,
  JsxAST,
  Middleware,
  Styles,
  UriProps,
  UriState,
  XmlAST,
  XmlProps,
  XmlState,
  AstProps,
} from './xml';

import {
  RNSVGCircle,
  RNSVGClipPath,
  RNSVGDefs,
  RNSVGEllipse,
  RNSVGForeignObject,
  RNSVGGroup,
  RNSVGImage,
  RNSVGLine,
  RNSVGLinearGradient,
  RNSVGMarker,
  RNSVGMask,
  RNSVGPath,
  RNSVGPattern,
  RNSVGRadialGradient,
  RNSVGRect,
  RNSVGSvgAndroid,
  RNSVGSvgIOS,
  RNSVGSymbol,
  RNSVGText,
  RNSVGTextPath,
  RNSVGTSpan,
  RNSVGUse,
  RNSVGFilter,
  RNSVGFeColorMatrix,
  RNSVGFeGaussianBlur,
  RNSVGFeOffset,
} from './fabric';

const {
  circle: Circle,
  clipPath: ClipPath,
  defs: Defs,
  ellipse: Ellipse,
  filter: Filter,
  feColorMatrix: FeColorMatrix,
  feGaussianBlur: FeGaussianBlur,
  feOffset: FeOffset,
  g: G,
  image: Image,
  line: Line,
  linearGradient: LinearGradient,
  marker: Marker,
  mask: Mask,
  path: Path,
  pattern: Pattern,
  polygon: Polygon,
  polyline: Polyline,
  radialGradient: RadialGradient,
  rect: Rect,
  stop: Stop,
  svg: Svg,
  symbol: Symbol,
  text: Text,
  textPath: TextPath,
  tspan: TSpan,
  use: Use,
  foreignObject: ForeignObject,
} = tags;

export {
  SvgCss,
  SvgCssUri,
  SvgWithCss,
  SvgWithCssUri,
  inlineStyles,
  LocalSvg,
  WithLocalSvg,
  loadLocalRawResource,
} from './deprecated';

export type { RectProps } from './elements/Rect';
export type { CircleProps } from './elements/Circle';
export type { EllipseProps } from './elements/Ellipse';
export type { PolygonProps } from './elements/Polygon';
export type { PolylineProps } from './elements/Polyline';
export type { LineProps } from './elements/Line';
export type { SvgProps } from './elements/Svg';
export type { PathProps } from './elements/Path';
export type { GProps } from './elements/G';
export type { TextProps } from './elements/Text';
export type { TSpanProps } from './elements/TSpan';
export type { TextPathProps } from './elements/TextPath';
export type { UseProps } from './elements/Use';
export type { ImageProps } from './elements/Image';
export type { SymbolProps } from './elements/Symbol';
export type { LinearGradientProps } from './elements/LinearGradient';
export type { RadialGradientProps } from './elements/RadialGradient';
export type { StopProps } from './elements/Stop';
export type { ClipPathProps } from './elements/ClipPath';
export type { PatternProps } from './elements/Pattern';
export type { MaskProps } from './elements/Mask';
export type { MarkerProps } from './elements/Marker';
export type { ForeignObjectProps } from './elements/ForeignObject';
export type { FilterProps } from './elements/filters/Filter';
export type { FeColorMatrixProps } from './elements/filters/FeColorMatrix';
export type { FeGaussianBlurProps } from './elements/filters/FeGaussianBlur';
export type { FeOffsetProps } from './elements/filters/FeOffset';
export type { FilterPrimitiveCommonProps } from './elements/filters/FilterPrimitive';

export * from './lib/extract/types';

export {
  Svg,
  Circle,
  Ellipse,
  G,
  Text,
  TSpan,
  TextPath,
  Path,
  Polygon,
  Polyline,
  Line,
  Rect,
  Use,
  Image,
  Symbol,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  ClipPath,
  Pattern,
  Mask,
  Marker,
  ForeignObject,
  parse,
  SvgAst,
  SvgFromUri,
  SvgFromXml,
  SvgUri,
  SvgXml,
  camelCase,
  fetchText,
  Shape,
  Filter,
  FeColorMatrix,
  FeGaussianBlur,
  FeOffset,
  RNSVGMarker,
  RNSVGMask,
  RNSVGPattern,
  RNSVGClipPath,
  RNSVGRadialGradient,
  RNSVGLinearGradient,
  RNSVGDefs,
  RNSVGSymbol,
  RNSVGImage,
  RNSVGUse,
  RNSVGTextPath,
  RNSVGTSpan,
  RNSVGText,
  RNSVGGroup,
  RNSVGPath,
  RNSVGLine,
  RNSVGEllipse,
  RNSVGCircle,
  RNSVGRect,
  RNSVGSvgAndroid,
  RNSVGSvgIOS,
  RNSVGForeignObject,
  RNSVGFilter,
  RNSVGFeColorMatrix,
  RNSVGFeGaussianBlur,
  RNSVGFeOffset,
};

export type {
  JsxAST,
  Middleware,
  Styles,
  UriProps,
  UriState,
  XmlAST,
  XmlProps,
  XmlState,
  AstProps,
};

export default Svg;

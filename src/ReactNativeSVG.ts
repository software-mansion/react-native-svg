import Shape from './elements/Shape';
import {
  AstProps,
  camelCase,
  JsxAST,
  Middleware,
  parse,
  Styles,
  SvgAst,
  SvgFromUri,
  SvgFromXml,
  SvgUri,
  SvgXml,
  UriProps,
  UriState,
  XmlAST,
  XmlProps,
  XmlState,
} from './xml';

import { fetchText } from './utils/fetchData';

import {
  RNSVGCircle,
  RNSVGClipPath,
  RNSVGDefs,
  RNSVGEllipse,
  RNSVGFeColorMatrix,
  RNSVGFeComposite,
  RNSVGFeGaussianBlur,
  RNSVGFeMerge,
  RNSVGFeOffset,
  RNSVGFilter,
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
} from './fabric';

export {
  inlineStyles,
  loadLocalRawResource,
  LocalSvg,
  SvgCss,
  SvgCssUri,
  SvgWithCss,
  SvgWithCssUri,
  WithLocalSvg,
} from './deprecated';

export type { CircleProps } from './elements/Circle';
export type { ClipPathProps } from './elements/ClipPath';
export type { EllipseProps } from './elements/Ellipse';
export type { FeBlendProps } from './elements/filters/FeBlend';
export type { FeColorMatrixProps } from './elements/filters/FeColorMatrix';
export type { FeComponentTransferProps } from './elements/filters/FeComponentTransfer';
export type {
  FeFuncAProps,
  FeFuncBProps,
  FeFuncGProps,
  FeFuncRProps,
} from './elements/filters/FeComponentTransferFunction';
export type { FeCompositeProps } from './elements/filters/FeComposite';
export type { FeConvolveMatrixProps } from './elements/filters/FeConvolveMatrix';
export type { FeDiffuseLightingProps } from './elements/filters/FeDiffuseLighting';
export type { FeDisplacementMapProps } from './elements/filters/FeDisplacementMap';
export type { FeDistantLightProps } from './elements/filters/FeDistantLight';
export type { FeDropShadowProps } from './elements/filters/FeDropShadow';
export type { FeFloodProps } from './elements/filters/FeFlood';
export type { FeGaussianBlurProps } from './elements/filters/FeGaussianBlur';
export type { FeImageProps } from './elements/filters/FeImage';
export type { FeMergeProps } from './elements/filters/FeMerge';
export type { FeMergeNodeProps } from './elements/filters/FeMergeNode';
export type { FeMorphologyProps } from './elements/filters/FeMorphology';
export type { FeOffsetProps } from './elements/filters/FeOffset';
export type { FePointLightProps } from './elements/filters/FePointLight';
export type { FeSpecularLightingProps } from './elements/filters/FeSpecularLighting';
export type { FeSpotLightProps } from './elements/filters/FeSpotLight';
export type { FeTileProps } from './elements/filters/FeTile';
export type { FeTurbulenceProps } from './elements/filters/FeTurbulence';
export type { FilterProps } from './elements/filters/Filter';
export type { FilterPrimitiveCommonProps } from './elements/filters/FilterPrimitive';
export type { ForeignObjectProps } from './elements/ForeignObject';
export type { GProps } from './elements/G';
export type { ImageProps } from './elements/Image';
export type { LineProps } from './elements/Line';
export type { LinearGradientProps } from './elements/LinearGradient';
export type { MarkerProps } from './elements/Marker';
export type { MaskProps } from './elements/Mask';
export type { PathProps } from './elements/Path';
export type { PatternProps } from './elements/Pattern';
export type { PolygonProps } from './elements/Polygon';
export type { PolylineProps } from './elements/Polyline';
export type { RadialGradientProps } from './elements/RadialGradient';
export type { RectProps } from './elements/Rect';
export type { StopProps } from './elements/Stop';
export type { SvgProps } from './elements/Svg';
export type { SymbolProps } from './elements/Symbol';
export type { TextProps } from './elements/Text';
export type { TextPathProps } from './elements/TextPath';
export type { TSpanProps } from './elements/TSpan';
export type { UseProps } from './elements/Use';

export * from './lib/extract/types';

export {
  camelCase,
  fetchText,
  parse,
  RNSVGCircle,
  RNSVGClipPath,
  RNSVGDefs,
  RNSVGEllipse,
  RNSVGFeColorMatrix,
  RNSVGFeComposite,
  RNSVGFeGaussianBlur,
  RNSVGFeMerge,
  RNSVGFeOffset,
  RNSVGFilter,
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
  Shape,
  SvgAst,
  SvgFromUri,
  SvgFromXml,
  SvgUri,
  SvgXml,
};

export type {
  AstProps,
  JsxAST,
  Middleware,
  Styles,
  UriProps,
  UriState,
  XmlAST,
  XmlProps,
  XmlState,
};

export * from './elements';
export { default } from './elements';

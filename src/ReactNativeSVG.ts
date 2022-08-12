import Shape from './elements/Shape';
import Rect, { RectProps } from './elements/Rect';
import Circle, { CircleProps } from './elements/Circle';
import Ellipse, { EllipseProps } from './elements/Ellipse';
import Polygon, { PolygonProps } from './elements/Polygon';
import Polyline, { PolylineProps } from './elements/Polyline';
import Line, { LineProps } from './elements/Line';
import Svg, { SvgProps } from './elements/Svg';
import Path, { PathProps } from './elements/Path';
import G, { GProps } from './elements/G';
import Text, { TextProps } from './elements/Text';
import TSpan, { TSpanProps } from './elements/TSpan';
import TextPath, { TextPathProps } from './elements/TextPath';
import Use, { UseProps } from './elements/Use';
import Image, { ImageProps } from './elements/Image';
import Symbol, { SymbolProps } from './elements/Symbol';
import Defs from './elements/Defs';
import LinearGradient, { LinearGradientProps } from './elements/LinearGradient';
import RadialGradient, { RadialGradientProps } from './elements/RadialGradient';
import Stop, { StopProps } from './elements/Stop';
import ClipPath, { ClipPathProps } from './elements/ClipPath';
import Pattern, { PatternProps } from './elements/Pattern';
import Mask, { MaskProps } from './elements/Mask';
import Marker, { MarkerProps } from './elements/Marker';
import ForeignObject, { ForeignObjectProps } from './elements/ForeignObject';

import {
  parse,
  SvgAst,
  SvgFromUri,
  SvgFromXml,
  SvgUri,
  SvgXml,
  UriProps,
  XmlProps,
  AstProps,
} from './xml';
import {
  SvgCss,
  SvgCssUri,
  SvgWithCss,
  SvgWithCssUri,
  inlineStyles,
} from './css';
import {
  LocalSvg,
  WithLocalSvg,
  loadLocalRawResource,
  LocalProps,
} from './LocalSvg';
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
  RNSVGSvg,
  RNSVGSymbol,
  RNSVGText,
  RNSVGTextPath,
  RNSVGTSpan,
  RNSVGUse,
} from './elements/NativeComponents';

export {
  RectProps,
  CircleProps,
  EllipseProps,
  PolygonProps,
  PolylineProps,
  LineProps,
  SvgProps,
  PathProps,
  GProps,
  TextProps,
  TSpanProps,
  TextPathProps,
  UseProps,
  ImageProps,
  SymbolProps,
  LinearGradientProps,
  RadialGradientProps,
  StopProps,
  ClipPathProps,
  PatternProps,
  MaskProps,
  MarkerProps,
  ForeignObjectProps,
  UriProps,
  XmlProps,
  AstProps,
  LocalProps,
};

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
  SvgCss,
  SvgCssUri,
  SvgWithCss,
  SvgWithCssUri,
  inlineStyles,
  LocalSvg,
  WithLocalSvg,
  loadLocalRawResource,
  Shape,
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
  RNSVGSvg,
  RNSVGForeignObject,
};

export default Svg;

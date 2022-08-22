/**
 * @flow strict-local
 * @format
 */
/* eslint-disable */
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { HostComponent } from 'react-native/Libraries/Renderer/shims/ReactNativeTypes';
import type { ViewProps } from 'react-native/Libraries/Components/View/ViewPropTypes';

import type { DirectEventHandler } from 'react-native/Libraries/Types/CodegenTypes';

// for some reason the parser doesn't allow to put flow types in another file
// import type { SvgNodeCommonProps } from './svgNodeCommonProps';

type LayoutEvent = $ReadOnly<{|
  layout: $ReadOnly<{|
    x: Float,
    y: Float,
    width: Float,
    height: Float,
  |}>,
|}>;

type SvgNodeCommonProps = $ReadOnly<{|
  name?: string,
  opacity?: WithDefault<Float, 1.0>,
  matrix?: $ReadOnlyArray<Float>, //CGAffineTransform,
  // transform?: ____TransformStyle_Internal, // CATransform3D, custom handling
  mask?: string,
  markerStart?: string,
  markerMid?: string,
  markerEnd?: string,
  clipPath?: string,
  clipRule?: WithDefault<Int32, 0>,
  responsible?: boolean,
  onLayout?: ?DirectEventHandler<LayoutEvent>,
  display?: string,
|}>;

type ColorStruct = $ReadOnly<{|
  type?: WithDefault<Int32, -1>,
  value?: ColorValue,
  brushRef?: string,
|}>;

type SvgRenderableCommonProps = $ReadOnly<{|
  fill?: ColorStruct,
  fillOpacity?: WithDefault<Float, 1.0>,
  fillRule?: WithDefault<Int32, 1>,
  stroke?: ColorStruct,
  strokeOpacity?: WithDefault<Float, 1.0>,
  strokeWidth?: WithDefault<string, '1'>,
  strokeLinecap?: WithDefault<Int32, 0>,
  strokeLinejoin?: WithDefault<Int32, 0>,
  strokeDasharray?: $ReadOnlyArray<string>,
  strokeDashoffset?: Float,
  strokeMiterlimit?: Float,
  vectorEffect?: WithDefault<Int32, 0>,
  propList?: $ReadOnlyArray<string>,
|}>;

type FontObject = $ReadOnly<{|
  fontStyle?: string,
  fontVariant?: string,
  fontWeight?: string,
  fontStretch?: string,
  fontSize?: string,
  fontFamily?: string,
  textAnchor?: string,
  textDecoration?: string,
  letterSpacing?: string,
  wordSpacing?: string,
  kerning?: string,
  fontFeatureSettings?: string,
  fontVariantLigatures?: string,
  fontVariationSettings?: string,
|}>;

type SvgGroupCommonProps = $ReadOnly<{|
  fontSize?: string,
  fontWeight?: string,
  font?: FontObject,
|}>;

type NativeProps = $ReadOnly<{|
  ...ViewProps,
  ...SvgNodeCommonProps,
  ...SvgRenderableCommonProps,
  ...SvgGroupCommonProps,
  minX?: Float,
  minY?: Float,
  vbWidth?: Float,
  vbHeight?: Float,
  align?: string,
  meetOrSlice?: Int32,
|}>;

type ComponentType = HostComponent<NativeProps>;

export default (codegenNativeComponent<NativeProps>(
  'RNSVGSymbol',
  {},
): ComponentType);

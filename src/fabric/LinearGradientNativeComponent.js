/**
 * @flow strict-local
 * @format
 */
/* eslint-disable */
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ViewProps } from 'react-native/Libraries/Components/View/ViewPropTypes';
import type { HostComponent } from 'react-native/Libraries/Renderer/shims/ReactNativeTypes';
import { ColorValue } from 'react-native/Libraries/StyleSheet/StyleSheet';
import type { Int32, Double } from 'react-native/Libraries/Types/CodegenTypes';

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
  onLayout?: ?DirectEventHandler<LayoutEvent>, // not working for now
  display?: string,
|}>;

type Units = 'userSpaceOnUse' | 'objectBoundingBox';

type NativeProps = $ReadOnly<{|
  ...ViewProps,
  ...SvgNodeCommonProps,
  x1?: string,
  y1?: string,
  x2?: string,
  y2?: string,
  gradient?: $ReadOnlyArray<Float>,
  gradientUnits?: Int32,
  gradientTransform?: $ReadOnlyArray<Float>, //CGAffineTransform,
|}>;

type ComponentType = HostComponent<NativeProps>;

export default (codegenNativeComponent<NativeProps>(
  'RNSVGLinearGradient',
  {},
): ComponentType);

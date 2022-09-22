import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ViewProps } from 'react-native';
import type {
  Float,
  Int32,
  WithDefault,
} from 'react-native/Libraries/Types/CodegenTypes';

interface SvgNodeCommonProps {
  name?: string;
  opacity?: WithDefault<Float, 1.0>;
  matrix?: ReadonlyArray<Float>;
  // transform?: ____TransformStyle_Internal, // CATransform3D, custom handling
  mask?: string;
  markerStart?: string;
  markerMid?: string;
  markerEnd?: string;
  clipPath?: string;
  clipRule?: WithDefault<Int32, 0>;
  responsible?: boolean;
  display?: string;
}

interface NativeProps extends ViewProps, SvgNodeCommonProps {
  fx?: string;
  fy?: string;
  cx?: string;
  cy?: string;
  rx?: string;
  ry?: string;
  gradient?: ReadonlyArray<Float>;
  gradientUnits?: Int32;
  gradientTransform?: ReadonlyArray<Float>;
}

export default codegenNativeComponent<NativeProps>('RNSVGRadialGradient');

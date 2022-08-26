// @ts-ignore TODO: remove once there is a .d.ts file with definitions
import codegenNativeComponentUntyped from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { HostComponent, ViewProps } from 'react-native';
import type {
  Float,
  Int32,
  WithDefault,
  // @ts-ignore TODO: remove once there is a .d.ts file with definitions
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
  x1?: string;
  y1?: string;
  x2?: string;
  y2?: string;
  gradient?: ReadonlyArray<Float>;
  gradientUnits?: Int32;
  gradientTransform?: ReadonlyArray<Float>;
}

// eslint-disable-next-line @typescript-eslint/ban-types
const codegenNativeComponent = codegenNativeComponentUntyped as <T extends {}>(
  name: string,
) => HostComponent<T>;

export default codegenNativeComponent<NativeProps>('RNSVGLinearGradient');

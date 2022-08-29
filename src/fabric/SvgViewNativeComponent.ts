import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ViewProps, ColorValue } from 'react-native';
// @ts-ignore TODO: remove once there is a .d.ts file with definitions
import type { Float, Int32 } from 'react-native/Libraries/Types/CodegenTypes';

interface NativeProps extends ViewProps {
  bbWidth: string;
  bbHeight: string;
  minX: Float;
  minY: Float;
  vbWidth: Float;
  vbHeight: Float;
  align: string;
  meetOrSlice: Int32;
  tintColor: ColorValue;
  color: ColorValue;
}

export default codegenNativeComponent<NativeProps>('RNSVGSvgView');

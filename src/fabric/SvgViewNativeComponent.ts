import type { ColorValue, ViewProps } from 'react-native';
import type { Float, Int32 } from 'react-native/Libraries/Types/CodegenTypes';

import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

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
  pointerEvents?: string;
}

export default codegenNativeComponent<NativeProps>('RNSVGSvgView');

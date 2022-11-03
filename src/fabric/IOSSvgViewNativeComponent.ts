import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ColorValue } from 'react-native';
import type { Float, Int32 } from 'react-native/Libraries/Types/CodegenTypes';
import type { ViewProps } from './utils';

interface NativeProps extends ViewProps {
  bbWidth?: string;
  bbHeight?: string;
  minX?: Float;
  minY?: Float;
  vbWidth?: Float;
  vbHeight?: Float;
  align?: string;
  meetOrSlice?: Int32;
  tintColor?: ColorValue;
  color?: ColorValue;
  pointerEvents?: string;
}

export default codegenNativeComponent<NativeProps>('RNSVGSvgView', {
  excludedPlatforms: ['android'],
});

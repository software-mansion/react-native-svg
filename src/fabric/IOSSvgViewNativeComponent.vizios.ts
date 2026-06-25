import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { Float } from 'react-native/Libraries/Types/CodegenTypes';
import type { ViewProps } from './utils';

interface NativeProps extends ViewProps {
  svgUri?: string;
  minX?: Float;
  minY?: Float;
  vbWidth?: Float;
  vbHeight?: Float;
}

export default codegenNativeComponent<NativeProps>('RNSVGSvgView');

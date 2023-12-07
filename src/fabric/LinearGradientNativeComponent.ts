import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { Float, Int32 } from 'react-native/Libraries/Types/CodegenTypes';
import type { ViewProps } from './utils';
import type { SvgNodeCommonProps } from './commonTypes';

interface NativeProps extends ViewProps, SvgNodeCommonProps {
  x1?: string;
  y1?: string;
  x2?: string;
  y2?: string;
  gradient?: ReadonlyArray<Float>;
  gradientUnits?: Int32;
  gradientTransform?: ReadonlyArray<Float> | null;
}

export default codegenNativeComponent<NativeProps>('RNSVGLinearGradient');

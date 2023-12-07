import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { Float, Int32 } from 'react-native/Libraries/Types/CodegenTypes';
import type { ViewProps } from './utils';
import type {
  SvgNodeCommonProps,
  SvgRenderableCommonProps,
  SvgGroupCommonProps,
} from './commonTypes';

interface NativeProps
  extends ViewProps,
    SvgNodeCommonProps,
    SvgRenderableCommonProps,
    SvgGroupCommonProps {
  minX?: Float;
  minY?: Float;
  vbWidth?: Float;
  vbHeight?: Float;
  align?: string;
  meetOrSlice?: Int32;
}

export default codegenNativeComponent<NativeProps>('RNSVGSymbol');

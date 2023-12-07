import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
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
  x?: string;
  y?: string;
  height?: string;
  width?: string;
}

export default codegenNativeComponent<NativeProps>('RNSVGForeignObject');

import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ViewProps } from './utils';
import type {
  SvgNodeCommonProps,
  SvgRenderableCommonProps,
} from './commonTypes';

interface NativeProps
  extends ViewProps,
    SvgNodeCommonProps,
    SvgRenderableCommonProps {
  href?: string;
  x?: string;
  y?: string;
  height?: string;
  width?: string;
}

export default codegenNativeComponent<NativeProps>('RNSVGUse');

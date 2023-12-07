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
  x?: string;
  y?: string;
  height?: string;
  width?: string;
  rx?: string;
  ry?: string;
}

export default codegenNativeComponent<NativeProps>('RNSVGRect');

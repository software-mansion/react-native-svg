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
  d?: string;
}

export default codegenNativeComponent<NativeProps>('RNSVGPath');

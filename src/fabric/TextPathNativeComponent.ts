import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ViewProps } from './utils';
import type {
  SvgNodeCommonProps,
  SvgRenderableCommonProps,
  SvgGroupCommonProps,
  SvgTextCommonProps,
} from './commonTypes';
interface NativeProps
  extends ViewProps,
    SvgNodeCommonProps,
    SvgRenderableCommonProps,
    SvgGroupCommonProps,
    SvgTextCommonProps {
  href?: string;
  side?: string;
  method?: string;
  midLine?: string;
  spacing?: string;
  startOffset?: string;
}

export default codegenNativeComponent<NativeProps>('RNSVGTextPath');

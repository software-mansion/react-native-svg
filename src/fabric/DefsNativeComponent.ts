import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ViewProps } from './utils';
import type { SvgNodeCommonProps } from './commonTypes';

interface NativeProps extends ViewProps, SvgNodeCommonProps {}

export default codegenNativeComponent<NativeProps>('RNSVGDefs');

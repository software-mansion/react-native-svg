import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
// TODO: import ImageSource from codegen types when it is available
import type { ImageSourcePropType as ImageSource } from 'react-native';
import type { Int32 } from 'react-native/Libraries/Types/CodegenTypes';
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
  width?: string;
  height?: string;
  src?: ImageSource | null;
  align?: string;
  meetOrSlice?: Int32;
}

export default codegenNativeComponent<NativeProps>('RNSVGImage', {
  interfaceOnly: true,
});

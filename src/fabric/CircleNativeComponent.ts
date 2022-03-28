// @ts-ignore TS being TS
import codegenNativeComponentUntyped from 'react-native/Libraries/Utilities/codegenNativeComponent';
// @ts-ignore TS being TS
import type { Double } from 'react-native/Libraries/Types/CodegenTypes';
import type { ViewProps, HostComponent } from 'react-native';

interface NativeProps extends ViewProps {
    cx?: Double,
    cy?: Double,
    r?: Double,
}

// eslint-disable-next-line @typescript-eslint/ban-types
const codegenNativeComponent = codegenNativeComponentUntyped as <T extends {}>(
  name: string
) => HostComponent<T>;

export default codegenNativeComponent<NativeProps>('RNSVGCircle');
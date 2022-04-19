// @ts-ignore TS being TS
import codegenNativeComponentUntyped from 'react-native/Libraries/Utilities/codegenNativeComponent';
// @ts-ignore TS being TS
import type { Double, Int32 } from 'react-native/Libraries/Types/CodegenTypes';
import type { ViewProps, HostComponent } from 'react-native';

interface NativeProps extends ViewProps {
    cx?: Double,
    cy?: Double,
    r?: Double,
    fill?: Int32, // we will probably have to change it an array if it is possible 
}

// eslint-disable-next-line @typescript-eslint/ban-types
const codegenNativeComponent = codegenNativeComponentUntyped as <T extends {}>(
  name: string
) => HostComponent<T>;

export default codegenNativeComponent<NativeProps>('RNSVGCircle');
/**
 * @flow strict-local
 * @format
 */
/* eslint-disable */
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ViewProps } from 'react-native/Libraries/Components/View/ViewPropTypes';
import type { HostComponent } from 'react-native/Libraries/Renderer/shims/ReactNativeTypes';
import { ColorValue } from 'react-native/Libraries/StyleSheet/StyleSheet';
import type {
  BubblingEventHandler,
  WithDefault,
  Int32,
  Double,
} from 'react-native/Libraries/Types/CodegenTypes';


type NativeProps = $ReadOnly<{|
    ...ViewProps,
    cx?: Double,
    cy?: Double,
    r?: Double,
    // fill?: ColorValue, // we will probably have to change it an array if it is possible
    fill?: $ReadOnly<{|
      type: Int32,
      value?: ColorValue,
      brushRef?: string,
    |}>,//number | (string | number)[] | null,
|}>;

type ComponentType = HostComponent<NativeProps>;

export default (codegenNativeComponent<NativeProps>('RNSVGCircle', {}): ComponentType);
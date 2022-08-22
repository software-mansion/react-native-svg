/**
 * @flow strict-local
 * @format
 */
/* eslint-disable */
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

type NativeProps = $ReadOnly<{|
  ...ViewProps,
  bbWidth: string,
  bbHeight: string,
  minX: Float,
  minY: Float,
  vbWidth: Float,
  vbHeight: Float,
  align: string,
  meetOrSlice: Int32,
  tintColor: ColorValue,
  color: ColorValue,
|}>;

export default (codegenNativeComponent<NativeProps>(
  'RNSVGSvgView',
  {},
): ComponentType);

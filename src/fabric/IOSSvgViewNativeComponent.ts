import type { ColorValue } from 'react-native';
import type { Float, Int32 } from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import { NumberProp } from '../lib/extract/types';
import type { UnsafeMixed } from './codegenUtils';
import type { ViewProps } from './utils';

type HitSlop = Readonly<{
  left?: Float;
  top?: Float;
  right?: Float;
  bottom?: Float;
}>;

interface NativeProps extends ViewProps {
  bbWidth?: UnsafeMixed<NumberProp>;
  bbHeight?: UnsafeMixed<NumberProp>;
  minX?: Float;
  minY?: Float;
  vbWidth?: Float;
  vbHeight?: Float;
  align?: string;
  meetOrSlice?: Int32;
  color?: ColorValue;
  pointerEvents?: string;
  hitSlop?: UnsafeMixed<HitSlop | null | number | undefined>;
}

export default codegenNativeComponent<NativeProps>('RNSVGSvgView', {
  excludedPlatforms: ['android'],
});

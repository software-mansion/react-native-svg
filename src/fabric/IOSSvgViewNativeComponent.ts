import { codegenNativeComponent } from 'react-native';
import type { CodegenTypes, ColorValue } from 'react-native';
import type { ViewProps } from './utils';

import type { UnsafeMixed } from './codegenUtils';
import { NumberProp } from '../lib/extract/types';

type HitSlop = Readonly<{
  left?: CodegenTypes.Float;
  top?: CodegenTypes.Float;
  right?: CodegenTypes.Float;
  bottom?: CodegenTypes.Float;
}>;

interface NativeProps extends ViewProps {
  bbWidth?: UnsafeMixed<NumberProp>;
  bbHeight?: UnsafeMixed<NumberProp>;
  minX?: CodegenTypes.Float;
  minY?: CodegenTypes.Float;
  vbWidth?: CodegenTypes.Float;
  vbHeight?: CodegenTypes.Float;
  align?: string;
  meetOrSlice?: CodegenTypes.Int32;
  color?: ColorValue;
  pointerEvents?: string;
  hitSlop?: UnsafeMixed<HitSlop | null | number | undefined>;
}

export default codegenNativeComponent<NativeProps>('RNSVGSvgView', {
  excludedPlatforms: ['android'],
});

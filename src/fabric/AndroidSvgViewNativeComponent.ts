import { codegenNativeComponent } from 'react-native';
import type { CodegenTypes, ColorValue } from 'react-native';
import type { ViewProps } from './utils';

import type { UnsafeMixed } from './codegenUtils';
import { NumberProp } from '../lib/extract/types';

type NativeBackgroundProp = Readonly<{
  type?: string;
  color?: CodegenTypes.Float;
  borderless?: boolean;
  rippleRadius?: CodegenTypes.Float;
}>;

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

  // props needed for Android SvgView
  hasTVPreferredFocus?: boolean;
  borderBottomColor?: ColorValue;
  nextFocusDown?: CodegenTypes.Int32;
  borderRightColor?: ColorValue;
  nextFocusRight?: CodegenTypes.Int32;
  borderLeftColor?: ColorValue;
  borderColor?: ColorValue;
  removeClippedSubviews?: boolean;
  nextFocusForward?: CodegenTypes.Int32;
  nextFocusUp?: CodegenTypes.Int32;
  accessible?: boolean;
  borderStartColor?: ColorValue;
  borderEndColor?: ColorValue;
  focusable?: boolean;
  nativeBackgroundAndroid?: NativeBackgroundProp; // maybe there should a value accepted by codegen for this?
  nativeForegroundAndroid?: NativeBackgroundProp; // maybe there should a value accepted by codegen for this?
  backfaceVisibility?: string;
  borderStyle?: string;
  needsOffscreenAlphaCompositing?: boolean;
  hitSlop?: UnsafeMixed<HitSlop | null | number | undefined>;
  borderTopColor?: ColorValue;
  nextFocusLeft?: CodegenTypes.Int32;
  borderBlockColor?: ColorValue;
  borderBlockEndColor?: ColorValue;
  borderBlockStartColor?: ColorValue;
  borderRadius?: UnsafeMixed<CodegenTypes.Double | string>;
  borderTopLeftRadius?: UnsafeMixed<CodegenTypes.Double | string>;
  borderTopRightRadius?: UnsafeMixed<CodegenTypes.Double | string>;
  borderBottomRightRadius?: UnsafeMixed<CodegenTypes.Double | string>;
  borderBottomLeftRadius?: UnsafeMixed<CodegenTypes.Double | string>;
  borderTopStartRadius?: UnsafeMixed<CodegenTypes.Double | string>;
  borderTopEndRadius?: UnsafeMixed<CodegenTypes.Double | string>;
  borderBottomStartRadius?: UnsafeMixed<CodegenTypes.Double | string>;
  borderBottomEndRadius?: UnsafeMixed<CodegenTypes.Double | string>;
  borderEndEndRadius?: UnsafeMixed<CodegenTypes.Double | string>;
  borderEndStartRadius?: UnsafeMixed<CodegenTypes.Double | string>;
  borderStartEndRadius?: UnsafeMixed<CodegenTypes.Double | string>;
  borderStartStartRadius?: UnsafeMixed<CodegenTypes.Double | string>;
}

export default codegenNativeComponent<NativeProps>('RNSVGSvgViewAndroid', {
  excludedPlatforms: ['iOS'],
});

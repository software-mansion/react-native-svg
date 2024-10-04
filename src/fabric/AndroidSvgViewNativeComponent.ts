import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ColorValue } from 'react-native';
import type {
  Double,
  Float,
  Int32,
} from 'react-native/Libraries/Types/CodegenTypes';
import type { ViewProps } from './utils';

import type { UnsafeMixed } from './codegenUtils';
import { NumberProp } from '../lib/extract/types';

type NativeBackgroundProp = Readonly<{
  type?: string;
  color?: Float;
  borderless?: boolean;
  rippleRadius?: Float;
}>;

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

  // props needed for Android SvgView
  hasTVPreferredFocus?: boolean;
  borderBottomColor?: ColorValue;
  nextFocusDown?: Int32;
  borderRightColor?: ColorValue;
  nextFocusRight?: Int32;
  borderLeftColor?: ColorValue;
  borderColor?: ColorValue;
  removeClippedSubviews?: boolean;
  nextFocusForward?: Int32;
  nextFocusUp?: Int32;
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
  nextFocusLeft?: Int32;
  borderBlockColor?: ColorValue;
  borderBlockEndColor?: ColorValue;
  borderBlockStartColor?: ColorValue;
  borderRadius?: UnsafeMixed<Double | string>;
  borderTopLeftRadius?: UnsafeMixed<Double | string>;
  borderTopRightRadius?: UnsafeMixed<Double | string>;
  borderBottomRightRadius?: UnsafeMixed<Double | string>;
  borderBottomLeftRadius?: UnsafeMixed<Double | string>;
  borderTopStartRadius?: UnsafeMixed<Double | string>;
  borderTopEndRadius?: UnsafeMixed<Double | string>;
  borderBottomStartRadius?: UnsafeMixed<Double | string>;
  borderBottomEndRadius?: UnsafeMixed<Double | string>;
  borderEndEndRadius?: UnsafeMixed<Double | string>;
  borderEndStartRadius?: UnsafeMixed<Double | string>;
  borderStartEndRadius?: UnsafeMixed<Double | string>;
  borderStartStartRadius?: UnsafeMixed<Double | string>;
}

export default codegenNativeComponent<NativeProps>('RNSVGSvgViewAndroid', {
  excludedPlatforms: ['iOS'],
});

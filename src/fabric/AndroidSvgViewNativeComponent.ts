import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ColorValue } from 'react-native';
import type {
  Double,
  Float,
  Int32,
} from 'react-native/Libraries/Types/CodegenTypes';
import type { ViewProps } from './utils';

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
  bbWidth?: string;
  bbHeight?: string;
  minX?: Float;
  minY?: Float;
  vbWidth?: Float;
  vbHeight?: Float;
  align?: string;
  meetOrSlice?: Int32;
  tintColor?: ColorValue;
  color?: ColorValue;
  pointerEvents?: string;

  // props needed for Android SvgView
  hasTVPreferredFocus?: boolean;
  borderTopEndRadius?: Float;
  borderBottomStartRadius?: Float;
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
  borderBottomEndRadius?: Float;
  borderEndColor?: ColorValue;
  focusable?: boolean;
  nativeBackgroundAndroid?: NativeBackgroundProp; // maybe there should a value accepted by codegen for this?
  borderTopStartRadius?: Float;
  nativeForegroundAndroid?: NativeBackgroundProp; // maybe there should a value accepted by codegen for this?
  backfaceVisibility?: string;
  borderStyle?: string;
  needsOffscreenAlphaCompositing?: boolean;
  hitSlop?: HitSlop;
  borderTopColor?: ColorValue;
  nextFocusLeft?: Int32;
  // TODO: those props are present in the `ReactPropGroup` but are not supported
  // (https://github.com/facebook/react-native/blob/35556dba600fbb28e0f41340a74b6c4a59bc6018/ReactAndroid/src/main/java/com/facebook/react/uimanager/BaseViewManager.java#L613)
  // and static view config validator says that they are missing.
  // We pass them as doubles although they should be floats, and cast them to floats again on the native side.
  borderTopRightRadius?: Double;
  borderBottomRightRadius?: Double;
  borderRadius?: Double;
  borderBottomLeftRadius?: Double;
  borderTopLeftRadius?: Double;
  borderBlockColor?: ColorValue;
  borderBlockEndColor?: ColorValue;
  borderBlockStartColor?: ColorValue;
  borderEndEndRadius?: Double;
  borderEndStartRadius?: Double;
  borderStartEndRadius?: Double;
  borderStartStartRadius?: Double;
}

export default codegenNativeComponent<NativeProps>('RNSVGSvgViewAndroid', {
  excludedPlatforms: ['iOS'],
});

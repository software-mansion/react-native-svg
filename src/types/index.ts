import type { GestureResponderEvent } from 'react-native';
import type {
  NumberArray,
  NumberProp,
  TransformProps,
} from '../lib/extract/types';

export interface CreateComponentProps extends BaseProps {
  tag: keyof React.JSX.IntrinsicElements;
  forwardedRef?: React.Ref<SVGElement> | React.MutableRefObject<SVGElement>;
}

type GestureResponder = (event: GestureResponderEvent) => boolean | void;

export interface Props {
  onMoveShouldSetResponder?: GestureResponder;
  onMoveShouldSetResponderCapture?: GestureResponder;
  onResponderEnd?: GestureResponder;
  onResponderGrant?: GestureResponder;
  onResponderMove?: GestureResponder;
  onResponderReject?: GestureResponder;
  onResponderRelease?: GestureResponder;
  onResponderStart?: GestureResponder;
  onResponderTerminate?: GestureResponder;
  onResponderTerminationRequest?: (event: GestureResponderEvent) => boolean;
  onScrollShouldSetResponder?: GestureResponder;
  onScrollShouldSetResponderCapture?: GestureResponder;
  onSelectionChangeShouldSetResponder?: GestureResponder;
  onSelectionChangeShouldSetResponderCapture?: GestureResponder;
  onStartShouldSetResponder?: (event: GestureResponderEvent) => boolean;
  onStartShouldSetResponderCapture?: GestureResponder;

  onBlur?: (e: BlurEvent) => void;
  onFocus?: (e: FocusEvent) => void;
  onLayout?: (event: LayoutEvent) => object;
  onLongPress?: (event: PressEvent) => object;
  onPressMove?: (event: PressEvent) => object;
  onClick?: (event: PressEvent) => object;
  onPress?: (event: PressEvent) => object;
  onPressIn?: (event: PressEvent) => object;
  onPressOut?: (event: PressEvent) => object;
}

type BlurEvent = object;
type FocusEvent = object;
type PressEvent = object;
type LayoutEvent = object;
type EdgeInsetsProp = object;

export interface BaseProps extends Props {
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityIgnoresInvertColors?: boolean;
  accessibilityRole?: string;
  accessibilityState?: object;
  delayLongPress?: number;
  delayPressIn?: number;
  delayPressOut?: number;
  disabled?: boolean;
  hitSlop?: EdgeInsetsProp;
  nativeID?: string;
  touchSoundDisabled?: boolean;
  pressRetentionOffset?: EdgeInsetsProp;
  rejectResponderTermination?: boolean;

  activeOpacity?: number;
  transform?: TransformProps['transform'];
  translate?: NumberArray;
  translateX?: NumberProp;
  translateY?: NumberProp;
  scale?: NumberArray;
  scaleX?: NumberProp;
  scaleY?: NumberProp;
  rotation?: NumberProp;
  skewX?: NumberProp;
  skewY?: NumberProp;
  origin?: NumberArray;
  originX?: NumberProp;
  originY?: NumberProp;

  fontStyle?: string;
  fontWeight?: NumberProp;
  fontSize?: NumberProp;
  fontFamily?: string;
  style?: Iterable<unknown>;

  // different transform props
  gradientTransform?: TransformProps['transform'];
  patternTransform?: TransformProps['transform'];
}

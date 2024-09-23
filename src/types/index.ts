import { MutableRefObject, Ref, JSX } from 'react';
import { ResponderConfig } from '../web/hooks/useResponderEvents/ResponderSystem';
import type { ImageProps as RNImageProps } from 'react-native';
import type {
  NumberArray,
  NumberProp,
  TransformProps,
} from '../lib/extract/types';

export interface CreateComponentProps extends BaseProps {
  tag: keyof JSX.IntrinsicElements;
  elementRef?: MutableRefObject<SVGElement | null>;
  forwardedRef?: Ref<SVGElement> | MutableRefObject<SVGElement>;
}

export interface Props extends ResponderConfig {
  onBlur?: (e: BlurEvent) => void;
  onFocus?: (e: FocusEvent) => void;
  onLayout?: (event: LayoutEvent) => void | null | undefined;
  onLongPress?: (event: PressEvent) => void | null | undefined;
  onPressMove?: (event: PressEvent) => void | null | undefined;
  onClick?: (event: PressEvent) => void | null | undefined;
  onPress?: (event: PressEvent) => void | null | undefined;
  onPressIn?: (event: PressEvent) => void | null | undefined;
  onPressOut?: (event: PressEvent) => void | null | undefined;
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
  accessibilityState?: object;
  delayLongPress?: number;
  delayPressIn?: number;
  delaypressin?: number;
  delayPressOut?: number;
  disabled?: boolean;
  hitSlop?: EdgeInsetsProp;
  href?: RNImageProps['source'] | string | number;
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

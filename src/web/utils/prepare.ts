import {
  GestureResponderEvent,
  type ImageProps as RNImageProps,
} from 'react-native';
import { BaseProps } from '../types';
import { WebShape } from '../WebShape';
import { hasTouchableProperty } from './hasProperty';
import { parseTransformProp } from './parseTransform';
import { resolve } from '../../lib/resolve';
import { NumberProp } from '../../lib/extract/types';
import { resolveAssetUri } from '../../lib/resolveAssetUri';
/**
 * `react-native-svg` supports additional props that aren't defined in the spec.
 * This function replaces them in a spec conforming manner.
 *
 * @param {WebShape} self Instance given to us.
 * @param {Object?} props Optional overridden props given to us.
 * @returns {Object} Cleaned props object.
 * @private
 */
export const prepare = <T extends BaseProps>(
  self: WebShape<T>,
  props = self.props
) => {
  const {
    transform,
    origin,
    originX,
    originY,
    fontFamily,
    fontSize,
    fontWeight,
    fontStyle,
    style,
    forwardedRef,
    gradientTransform,
    patternTransform,
    onPress,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    accessible,
    accessibilityElementsHidden,
    importantForAccessibility,
    ...rest
  } = props;

  const clean: {
    onStartShouldSetResponder?: (e: GestureResponderEvent) => boolean;
    onResponderMove?: (e: GestureResponderEvent) => void;
    onResponderGrant?: (e: GestureResponderEvent) => void;
    onResponderRelease?: (e: GestureResponderEvent) => void;
    onResponderTerminate?: (e: GestureResponderEvent) => void;
    onResponderTerminationRequest?: (e: GestureResponderEvent) => boolean;
    onClick?: (e: GestureResponderEvent) => void;
    transform?: string;
    gradientTransform?: string;
    patternTransform?: string;
    transformOrigin?: string;
    'aria-hidden'?: boolean;
    href?: RNImageProps['source'] | string | null;
    style?: object;
    ref?: unknown;
  } = {
    ...(hasTouchableProperty(props)
      ? {
          onStartShouldSetResponder:
            self.touchableHandleStartShouldSetResponder,
          onResponderTerminationRequest:
            self.touchableHandleResponderTerminationRequest,
          onResponderGrant: self.touchableHandleResponderGrant,
          onResponderMove: self.touchableHandleResponderMove,
          onResponderRelease: self.touchableHandleResponderRelease,
          onResponderTerminate: self.touchableHandleResponderTerminate,
        }
      : null),
    ...rest,
  };

  // React Native only props are not valid DOM attributes, so we do not pass them on.
  // The ones that hide an element and its children become `aria-hidden`.
  if (
    clean['aria-hidden'] == null &&
    (accessibilityElementsHidden === true ||
      importantForAccessibility === 'no-hide-descendants')
  ) {
    clean['aria-hidden'] = true;
  }

  if (origin != null) {
    clean.transformOrigin = origin.toString().replace(',', ' ');
  } else if (originX != null || originY != null) {
    clean.transformOrigin = `${originX || 0} ${originY || 0}`;
  }

  // we do it like this because setting transform as undefined causes error in web
  const parsedTransform = parseTransformProp(transform, props);
  if (parsedTransform) {
    clean.transform = parsedTransform;
  }
  const parsedGradientTransform = parseTransformProp(gradientTransform);
  if (parsedGradientTransform) {
    clean.gradientTransform = parsedGradientTransform;
  }
  const parsedPatternTransform = parseTransformProp(patternTransform);
  if (parsedPatternTransform) {
    clean.patternTransform = parsedPatternTransform;
  }

  clean.ref = (el: SVGElement | null) => {
    self.elementRef.current = el;
    if (typeof forwardedRef === 'function') {
      forwardedRef(el);
    } else if (forwardedRef) {
      forwardedRef.current = el;
    }
  };

  const styles: {
    fontStyle?: string;
    fontFamily?: string;
    fontSize?: NumberProp;
    fontWeight?: NumberProp;
  } = {};

  if (fontFamily != null) {
    styles.fontFamily = fontFamily;
  }
  if (fontSize != null) {
    styles.fontSize = fontSize;
  }
  if (fontWeight != null) {
    styles.fontWeight = fontWeight;
  }
  if (fontStyle != null) {
    styles.fontStyle = fontStyle;
  }
  clean.style = resolve(style, styles);
  if (onPress !== null) {
    clean.onClick = props.onPress;
  }
  if (props.href !== null && props.href !== undefined) {
    clean.href = resolveAssetUri(props.href)?.uri;
  }
  return clean;
};

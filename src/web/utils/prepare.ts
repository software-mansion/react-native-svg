import type { NumberProp } from '../../lib/extract/types';
import type { CreateComponentProps } from '../../types';
import { resolve } from '../../lib/resolve';
import { resolveAssetUri } from '../../lib/resolveAssetUri';
import { parseTransformProp } from './parseTransform';

/**
 * `react-native-svg` supports additional props that aren't defined in the spec.
 * This function replaces them in a spec conforming manner.
 */
interface PreparedComponentProps extends CreateComponentProps {
  'transform-origin'?: string;
  ref?: unknown;
}

export const prepare = (props: CreateComponentProps) => {
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
    ...rest
  } = props;

  const clean: PreparedComponentProps = rest;

  if (origin !== null && origin !== undefined) {
    clean['transform-origin'] = origin.toString().replace(',', ' ');
  } else if (
    (originX !== null && originX !== undefined) ||
    (originY !== null && originY !== undefined)
  ) {
    clean['transform-origin'] = `${originX || 0} ${originY || 0}`;
  }

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
    if (el) {
      const elementRef =
        props.forwardedRef as React.MutableRefObject<SVGElement | null>;
      elementRef.current = el;
      if (typeof forwardedRef === 'function') {
        forwardedRef(el);
      } else if (forwardedRef) {
        (
          forwardedRef as unknown as React.MutableRefObject<SVGElement>
        ).current = el;
      }
    }
  };

  const styles: {
    fontStyle?: string;
    fontFamily?: string;
    fontSize?: NumberProp;
    fontWeight?: NumberProp;
  } = {};

  if (fontFamily !== null && fontFamily !== undefined) {
    styles.fontFamily = fontFamily;
  }
  if (fontSize !== null && fontSize !== undefined) {
    styles.fontSize = fontSize;
  }
  if (fontWeight !== null && fontWeight !== undefined) {
    styles.fontWeight = fontWeight;
  }
  if (fontStyle !== null && fontStyle !== undefined) {
    styles.fontStyle = fontStyle;
  }
  if (props.href !== null && props.href !== undefined) {
    clean.href = resolveAssetUri(props.href)?.uri;
  }
  clean.style = resolve(style, styles);
  return clean;
};

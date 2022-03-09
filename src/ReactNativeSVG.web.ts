import * as React from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
  createElement,
  // @ts-expect-error
  unstable_createElement,
} from 'react-native';
import { NumberArray, NumberProp } from './lib/extract/types';
import { resolve } from './lib/resolve';

const RNWCreateElement: typeof createElement =
  unstable_createElement || createElement;

const styles = StyleSheet.create({
  base: {
    display: 'flex',
    flexBasis: 'auto',
    flexGrow: 0,
    flexShrink: 0,
  },
});

interface BaseProps extends Omit<TouchableWithoutFeedbackProps, 'style'> {
  forwardedRef?: unknown;

  children?: React.ReactNode;
  fontFamily?: string;
  fontSize?: NumberProp;
  fontStyle?: string;
  fontWeight?: NumberProp;
  originX?: NumberProp;
  originY?: NumberProp;
  rotation?: NumberArray;
  scale?: NumberArray;
  skewX?: NumberProp;
  skewY?: NumberProp;
  style?: Iterable<{}>;
  translate?: NumberArray;
}

const createSvgElement = (type: keyof React.ReactSVG, props: BaseProps) => {
  const {
    delayLongPress,
    delayPressIn,
    delayPressOut,
    disabled,
    onBlur,
    onFocus,
    onLongPress,
    onPress,
    onPressIn,
    onPressOut,

    forwardedRef,

    children,
    fontFamily,
    fontSize,
    fontStyle,
    fontWeight,
    originX,
    originY,
    rotation,
    scale,
    skewX,
    skewY,
    style,
    translate,

    // TouchableWithoutFeedback props unsupported by react-native-web
    hasTVPreferredFocus,
    hitSlop,
    pressRetentionOffset,
    touchSoundDisabled,
    tvParallaxProperties,

    ...otherProps
  } = props;

  const transformedProps: typeof otherProps & {
    ref?: unknown;
    style?: {};
    transform?: string;
  } = otherProps;

  const transform = [];

  if (originX != null || originY != null) {
    transform.push(`translate(${originX || 0}, ${originY || 0})`);
  }
  if (translate != null) {
    transform.push(`translate(${translate})`);
  }
  if (scale != null) {
    transform.push(`scale(${scale})`);
  }
  // rotation maps to rotate, not to collide with the text rotate attribute (which acts per glyph rather than block)
  if (rotation != null) {
    transform.push(`rotate(${rotation})`);
  }
  if (skewX != null) {
    transform.push(`skewX(${skewX})`);
  }
  if (skewY != null) {
    transform.push(`skewY(${skewY})`);
  }
  if (originX != null || originY != null) {
    transform.push(`translate(${-originX || 0}, ${-originY || 0})`);
  }

  if (transform.length) {
    transformedProps.transform = transform.join(' ');
  }

  if (forwardedRef) {
    transformedProps.ref = forwardedRef;
  }

  const additionalStyles: {
    fontStyle?: string;
    fontFamily?: string;
    fontSize?: NumberProp;
    fontWeight?: NumberProp;
  } = {};

  if (fontFamily != null) {
    additionalStyles.fontFamily = fontFamily;
  }
  if (fontSize != null) {
    additionalStyles.fontSize = fontSize;
  }
  if (fontWeight != null) {
    additionalStyles.fontWeight = fontWeight;
  }
  if (fontStyle != null) {
    additionalStyles.fontStyle = fontStyle;
  }

  transformedProps.style = StyleSheet.compose(
    styles.base,
    resolve(style, additionalStyles),
  );

  if (!(onLongPress || onPress || onPressIn || onPressOut)) {
    return RNWCreateElement(type, transformedProps, children);
  }

  return React.createElement(
    TouchableWithoutFeedback,
    {
      delayLongPress,
      delayPressIn,
      delayPressOut,
      disabled,
      onBlur,
      onFocus,
      onLongPress,
      onPress,
      onPressIn,
      onPressOut,
    },
    RNWCreateElement(type, transformedProps, children),
  );
};

export class Circle extends React.Component<BaseProps> {
  render(): JSX.Element {
    return createSvgElement('circle', this.props);
  }
}

export class ClipPath extends React.Component<BaseProps> {
  render(): JSX.Element {
    return createSvgElement('clipPath', this.props);
  }
}

export class Defs extends React.Component<BaseProps> {
  render(): JSX.Element {
    return createSvgElement('defs', this.props);
  }
}

export class Ellipse extends React.Component<BaseProps> {
  render(): JSX.Element {
    return createSvgElement('ellipse', this.props);
  }
}

export class G extends React.Component<
  BaseProps & {
    x?: NumberProp;
    y?: NumberProp;
    translate?: string;
  }
> {
  render(): JSX.Element {
    const { x, y, ...rest } = this.props;

    if ((x || y) && !rest.translate) {
      rest.translate = `${x || 0}, ${y || 0}`;
    }

    return createSvgElement('g', rest);
  }
}

export class Image extends React.Component<BaseProps> {
  render(): JSX.Element {
    return createSvgElement('image', this.props);
  }
}

export class Line extends React.Component<BaseProps> {
  render(): JSX.Element {
    return createSvgElement('line', this.props);
  }
}

export class LinearGradient extends React.Component<BaseProps> {
  render(): JSX.Element {
    return createSvgElement('linearGradient', this.props);
  }
}

export class Path extends React.Component<BaseProps> {
  render(): JSX.Element {
    return createSvgElement('path', this.props);
  }
}

export class Polygon extends React.Component<BaseProps> {
  render(): JSX.Element {
    return createSvgElement('polygon', this.props);
  }
}

export class Polyline extends React.Component<BaseProps> {
  render(): JSX.Element {
    return createSvgElement('polyline', this.props);
  }
}

export class RadialGradient extends React.Component<BaseProps> {
  render(): JSX.Element {
    return createSvgElement('radialGradient', this.props);
  }
}

export class Rect extends React.Component<BaseProps> {
  render(): JSX.Element {
    return createSvgElement('rect', this.props);
  }
}

export class Stop extends React.Component<BaseProps> {
  render(): JSX.Element {
    return createSvgElement('stop', this.props);
  }
}

export class Svg extends React.Component<BaseProps> {
  render(): JSX.Element {
    return createSvgElement('svg', this.props);
  }
}

export class Symbol extends React.Component<BaseProps> {
  render(): JSX.Element {
    return createSvgElement('symbol', this.props);
  }
}

export class Text extends React.Component<BaseProps> {
  render(): JSX.Element {
    return createSvgElement('text', this.props);
  }
}

export class TSpan extends React.Component<BaseProps> {
  render(): JSX.Element {
    return createSvgElement('tspan', this.props);
  }
}

export class TextPath extends React.Component<BaseProps> {
  render(): JSX.Element {
    return createSvgElement('textPath', this.props);
  }
}

export class Use extends React.Component<BaseProps> {
  render(): JSX.Element {
    return createSvgElement('use', this.props);
  }
}

export class Mask extends React.Component<BaseProps> {
  render(): JSX.Element {
    return createSvgElement('mask', this.props);
  }
}

export class ForeignObject extends React.Component<BaseProps> {
  render(): JSX.Element {
    return createSvgElement('foreignObject', this.props);
  }
}

export class Marker extends React.Component<BaseProps> {
  render(): JSX.Element {
    return createSvgElement('marker', this.props);
  }
}

export class Pattern extends React.Component<BaseProps> {
  render(): JSX.Element {
    return createSvgElement('pattern', this.props);
  }
}

export default Svg;

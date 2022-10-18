// @ts-ignore
import * as React from 'react';
import {
  GestureResponderEvent,
  // @ts-ignore
  unstable_createElement as ucE,
  // @ts-ignore
  createElement as cE,
} from 'react-native';
import {
  ColumnMajorTransformMatrix,
  NumberArray,
  NumberProp,
  TransformObject,
} from './lib/extract/types';
import SvgTouchableMixin from './lib/SvgTouchableMixin';
import { resolve } from './lib/resolve';

const createElement = cE || ucE;

type BlurEvent = Object;
type FocusEvent = Object;
type PressEvent = Object;
type LayoutEvent = Object;
type EdgeInsetsProp = Object;

interface BaseProps {
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityIgnoresInvertColors?: boolean;
  accessibilityRole?: string;
  accessibilityState?: Object;
  delayLongPress?: number;
  delayPressIn?: number;
  delayPressOut?: number;
  disabled?: boolean;
  hitSlop?: EdgeInsetsProp;
  nativeID?: string;
  touchSoundDisabled?: boolean;
  onBlur?: (e: BlurEvent) => void;
  onFocus?: (e: FocusEvent) => void;
  onLayout?: (event: LayoutEvent) => object;
  onLongPress?: (event: PressEvent) => object;
  onClick?: (event: PressEvent) => object;
  onPress?: (event: PressEvent) => object;
  onPressIn?: (event: PressEvent) => object;
  onPressOut?: (event: PressEvent) => object;
  pressRetentionOffset?: EdgeInsetsProp;
  rejectResponderTermination?: boolean;

  transform: ColumnMajorTransformMatrix | string | TransformObject;
  translate: NumberArray;
  translateX: NumberProp;
  translateY: NumberProp;
  scale: NumberArray;
  scaleX: NumberProp;
  scaleY: NumberProp;
  rotation: NumberArray;
  skewX: NumberProp;
  skewY: NumberProp;
  origin: NumberArray;
  originX: NumberProp;
  originY: NumberProp;

  fontStyle?: string;
  fontWeight?: NumberProp;
  fontSize?: NumberProp;
  fontFamily?: string;
  forwardedRef?:
    | React.RefCallback<SVGElement>
    | React.MutableRefObject<SVGElement | null>;
  style: Iterable<{}>;
}

const hasTouchableProperty = (props: BaseProps) =>
  props.onPress || props.onPressIn || props.onPressOut || props.onLongPress;

const camelCaseToDashed = (camelCase: string) => {
  return camelCase.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
};

/**
 * `react-native-svg` supports additional props that aren't defined in the spec.
 * This function replaces them in a spec conforming manner.
 *
 * @param {WebShape} self Instance given to us.
 * @param {Object?} props Optional overridden props given to us.
 * @returns {Object} Cleaned props object.
 * @private
 */
const prepare = <T extends BaseProps>(
  self: WebShape<T>,
  props = self.props,
) => {
  const {
    transform,
    translate,
    translateX,
    translateY,
    scale,
    scaleX,
    scaleY,
    rotation,
    skewX,
    skewY,
    origin,
    originX,
    originY,
    fontFamily,
    fontSize,
    fontWeight,
    fontStyle,
    style,
    forwardedRef,
    // @ts-ignore
    ...rest
  } = props;

  const clean: {
    onStartShouldSetResponder?: (e: GestureResponderEvent) => boolean;
    onResponderMove?: (e: GestureResponderEvent) => void;
    onResponderGrant?: (e: GestureResponderEvent) => void;
    onResponderRelease?: (e: GestureResponderEvent) => void;
    onResponderTerminate?: (e: GestureResponderEvent) => void;
    onResponderTerminationRequest?: (e: GestureResponderEvent) => boolean;
    transform?: ColumnMajorTransformMatrix | string | TransformObject;
    style?: {};
    ref?: {};
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

  const transformArray = [];

  if (Array.isArray(transform) && transform.length === 6) {
    transformArray.push(`matrix(${transform.join(' ')})`);
  } else if (typeof transform === 'object') {
    for (const key in transform) {
      const value = transform[key];
      // non standard SVG transforms
      if (key === 'translateX' || key === 'x') {
        transformArray.push(`translate(${value} 0)`);
      } else if (key === 'translateY' || key === 'y') {
        transformArray.push(`translate(0 ${value})`);
      } else if (key === 'originX') {
        transformArray.push(`translate(${-value} 0)`);
      } else if (key === 'originY') {
        transformArray.push(`translate(0 ${-value})`);
      } else if (key === 'origin') {
        if (Array.isArray(value)) {
          transformArray.push(`translate(${value.join(' ')})`);
        } else {
          transformArray.push(`translate(${value})`);
        }
      } else if (key === 'scaleX') {
        transformArray.push(`scaleX(${value} 1)`);
      } else if (key === 'scaleY') {
        transformArray.push(`scaleX(1 ${value})`);
      } else if (key === 'skew') {
        if (Array.isArray(value) && value.length === 2) {
          transformArray.push(`skewX(${value[0]})`);
          transformArray.push(`skewY(${value[1]})`);
        } else {
          throw new Error('Skew prop expect array of numbers');
        }
      } else {
        if (Array.isArray(value)) {
          transformArray.push(`${key}(${value.join(' ')})`);
        } else {
          transformArray.push(`${key}(${transform[key]})`);
        }
      }
    }
  } else {
    transformArray.push(transform);
  }

  if (translate != null) {
    transformArray.push(`translate(${translate})`);
  }
  if (translateX != null || translateY != null) {
    transformArray.push(`translate(${translateX || 0}, ${translateY || 0})`);
  }
  if (scale != null) {
    transformArray.push(`scale(${scale})`);
  }
  if (scaleX != null || scaleY != null) {
    transformArray.push(`scale(${scaleX || 1}, ${scaleY || 1})`);
  }
  // rotation maps to rotate, not to collide with the text rotate attribute (which acts per glyph rather than block)
  if (rotation != null) {
    transformArray.push(`rotate(${rotation})`);
  }
  if (skewX != null) {
    transformArray.push(`skewX(${skewX})`);
  }
  if (skewY != null) {
    transformArray.push(`skewY(${skewY})`);
  }
  if (origin != null) {
    transformArray.push(`translate(${origin})`);
  }
  if (originX != null || originY != null) {
    transformArray.push(`translate(${-originX || 0}, ${-originY || 0})`);
  }

  if (transformArray.length) {
    clean.transform = transformArray.join(' ');
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

  return clean;
};

const getBoundingClientRect = (node: SVGElement) => {
  if (node) {
    // @ts-ignore
    const isElement = node.nodeType === 1; /* Node.ELEMENT_NODE */
    // @ts-ignore
    if (isElement && typeof node.getBoundingClientRect === 'function') {
      // @ts-ignore
      return node.getBoundingClientRect();
    }
  }
};

const measureLayout = (
  node: SVGElement,
  callback: (
    x: number,
    y: number,
    width: number,
    height: number,
    left: number,
    top: number,
  ) => void,
) => {
  // @ts-ignore
  const relativeNode = node && node.parentNode;
  if (relativeNode) {
    setTimeout(() => {
      // @ts-ignore
      const relativeRect = getBoundingClientRect(relativeNode);
      const { height, left, top, width } = getBoundingClientRect(node);
      const x = left - relativeRect.left;
      const y = top - relativeRect.top;
      callback(x, y, width, height, left, top);
    }, 0);
  }
};

function remeasure() {
  // @ts-ignore
  const tag = this.state.touchable.responderID;
  if (tag == null) {
    return;
  }
  // @ts-ignore
  measureLayout(tag, this._handleQueryLayout);
}

export class WebShape<
  P extends BaseProps = BaseProps,
  C = {},
> extends React.Component<P, C> {
  [x: string]: unknown;
  protected tag?: React.ElementType;
  protected prepareProps(props: P) {
    return props;
  }

  elementRef =
    React.createRef<SVGElement>() as React.MutableRefObject<SVGElement | null>;
  lastMergedProps: Partial<P> = {};

  /**
   * disclaimer: I am not sure why the props are wrapped in a `style` attribute here, but that's how reanimated calls it
   */
  setNativeProps(props: { style: P }) {
    const merged = Object.assign(
      {},
      this.props,
      this.lastMergedProps,
      props.style,
    );
    this.lastMergedProps = merged;
    const clean = prepare(this, this.prepareProps(merged));
    const current = this.elementRef.current;
    if (current) {
      for (const cleanAttribute of Object.keys(clean)) {
        const cleanValue = clean[cleanAttribute as keyof typeof clean];
        switch (cleanAttribute) {
          case 'ref':
          case 'children':
            break;
          case 'style':
            // style can be an object here or an array, so we convert it to an array and assign each element
            for (const partialStyle of ([] as {}[]).concat(clean.style ?? [])) {
              // @ts-expect-error "DOM" is not part of `compilerOptions.lib`
              Object.assign(current.style, partialStyle);
            }
            break;
          default:
            // apply all other incoming prop updates as attributes on the node
            // same logic as in https://github.com/software-mansion/react-native-reanimated/blob/d04720c82f5941532991b235787285d36d717247/src/reanimated2/js-reanimated/index.ts#L38-L39
            // @ts-expect-error "DOM" is not part of `compilerOptions.lib`
            current.setAttribute(camelCaseToDashed(cleanAttribute), cleanValue);
            break;
        }
      }
    }
  }

  _remeasureMetricsOnActivation: () => void;
  touchableHandleStartShouldSetResponder?: (
    e: GestureResponderEvent,
  ) => boolean;
  touchableHandleResponderMove?: (e: GestureResponderEvent) => void;
  touchableHandleResponderGrant?: (e: GestureResponderEvent) => void;
  touchableHandleResponderRelease?: (e: GestureResponderEvent) => void;
  touchableHandleResponderTerminate?: (e: GestureResponderEvent) => void;
  touchableHandleResponderTerminationRequest?: (
    e: GestureResponderEvent,
  ) => boolean;
  constructor(props: P, context: C) {
    super(props, context);

    // Do not attach touchable mixin handlers if SVG element doesn't have a touchable prop
    if (hasTouchableProperty(props)) {
      SvgTouchableMixin(this);
    }

    this._remeasureMetricsOnActivation = remeasure.bind(this);
  }

  render(): JSX.Element {
    if (!this.tag) {
      throw new Error(
        'When extending `WebShape` you need to overwrite either `tag` or `render`!',
      );
    }
    this.lastMergedProps = {};
    return createElement(
      this.tag,
      prepare(this, this.prepareProps(this.props)),
    );
  }
}

export class Circle extends WebShape {
  tag = 'circle' as const;
}

export class ClipPath extends WebShape {
  tag = 'clipPath' as const;
}

export class Defs extends WebShape {
  tag = 'defs' as const;
}

export class Ellipse extends WebShape {
  tag = 'ellipse' as const;
}

export class G extends WebShape<
  BaseProps & {
    x?: NumberProp;
    y?: NumberProp;
    translate?: string;
  }
> {
  tag = 'g' as const;
  prepareProps(
    props: BaseProps & {
      x?: NumberProp;
      y?: NumberProp;
      translate?: string;
    },
  ) {
    const { x, y, ...rest } = props;

    if ((x || y) && !rest.translate) {
      rest.translate = `${x || 0}, ${y || 0}`;
    }

    return rest;
  }
}

export class Image extends WebShape {
  tag = 'image' as const;
}

export class Line extends WebShape {
  tag = 'line' as const;
}

export class LinearGradient extends WebShape {
  tag = 'linearGradient' as const;
}

export class Path extends WebShape {
  tag = 'path' as const;
}

export class Polygon extends WebShape {
  tag = 'polygon' as const;
}

export class Polyline extends WebShape {
  tag = 'polyline' as const;
}

export class RadialGradient extends WebShape {
  tag = 'radialGradient' as const;
}

export class Rect extends WebShape {
  tag = 'rect' as const;
}

export class Stop extends WebShape {
  tag = 'stop' as const;
}

export class Svg extends WebShape {
  tag = 'svg' as const;
}

export class Symbol extends WebShape {
  tag = 'symbol' as const;
}

export class Text extends WebShape {
  tag = 'text' as const;
}

export class TSpan extends WebShape {
  tag = 'tspan' as const;
}

export class TextPath extends WebShape {
  tag = 'textPath' as const;
}

export class Use extends WebShape {
  tag = 'use' as const;
}

export class Mask extends WebShape {
  tag = 'mask' as const;
}

export class ForeignObject extends WebShape {
  tag = 'foreignObject' as const;
}

export class Marker extends WebShape {
  tag = 'marker' as const;
}

export class Pattern extends WebShape {
  tag = 'pattern' as const;
}

export default Svg;

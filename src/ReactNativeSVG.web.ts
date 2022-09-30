// @ts-ignore
import * as React from 'react';
import {
  GestureResponderEvent,
  // @ts-ignore
  unstable_createElement as ucE,
  // @ts-ignore
  createElement as cE,
} from 'react-native';
import { NumberArray, NumberProp } from './lib/extract/types';
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

  translate: NumberArray;
  translateX: NumberProp;
  translateY: NumberProp;
  scale: NumberArray;
  rotation: NumberArray;
  skewX: NumberProp;
  skewY: NumberProp;
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
    translate,
    translateX,
    translateY,
    scale,
    rotation,
    skewX,
    skewY,
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
    transform?: string;
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

  const transform = [];

  if (originX != null || originY != null) {
    transform.push(`translate(${originX || 0}, ${originY || 0})`);
  }
  if (translate != null) {
    transform.push(`translate(${translate})`);
  }
  if (translateX != null || translateY != null) {
    transform.push(`translate(${translateX || 0}, ${translateY || 0})`);
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
    clean.transform = transform.join(' ');
  }

  clean.ref = (element: SVGElement | null) => {
    self.elementRef.current = element;
    /**
     * If the TouchableMixin is used, this already has been
     * set to `element` in `componentDidMount`.
     * We want to override `element.setAttribute`, so we replace
     *  it with a proxied version (not touching the real DOM node).
     */
    self._touchableNode = !element
      ? element
      : new Proxy(element, {
          get(target, p) {
            if (p === 'setAttribute') {
              return self.schedulePropUpdate.bind(self);
            }
            // @ts-expect-error this is always non-typesafe
            return target[p];
          },
        });
    // handle `forwardedRef` if it was present
    if (typeof forwardedRef === 'function') {
      forwardedRef(element);
    } else if (forwardedRef) {
      forwardedRef.current = element;
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

function dashedToCamelCase(dashedKey: string) {
  return dashedKey.replace(/-[a-z]/g, (m) => m[1].toUpperCase());
}
function camelCaseToDashed(camelCase: string) {
  return camelCase.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
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

  updatedProps: Record<string, unknown> = {};
  propUpdatesScheduled: number | undefined;
  schedulePropUpdate(dashedKey: string, value: unknown) {
    const key = dashedToCamelCase(dashedKey);
    this.updatedProps[key] = value;

    if (!this.propUpdatesScheduled) {
      this.propUpdatesScheduled = requestAnimationFrame(
        this.applyPropUpdates.bind(this),
      );
    }
  }
  resetPropUpdates() {
    this.updatedProps = {};
    if (this.propUpdatesScheduled) {
      cancelAnimationFrame(this.propUpdatesScheduled);
      this.propUpdatesScheduled = undefined;
    }
  }
  applyPropUpdates() {
    this.propUpdatesScheduled = undefined;

    const clean = prepare(
      this,
      this.prepareProps({ ...this.props, ...this.updatedProps }),
    );

    const current = this.elementRef.current;
    if (!current) {
      return;
    }
    for (const cleanAttribute of Object.keys(clean)) {
      const cleanValue = clean[cleanAttribute as keyof typeof clean];
      switch (cleanAttribute) {
        case 'ref':
        case 'children':
          break;
        case 'style':
          // @ts-expect-error "DOM" is not part of `compilerOptions.lib`
          Object.assign(current.style, cleanValue);
          break;
        default:
          // @ts-expect-error "DOM" is not part of `compilerOptions.lib`
          current.setAttribute(camelCaseToDashed(cleanAttribute), cleanValue);
          break;
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
    this.resetPropUpdates();
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

import * as React from 'react';
import type { GestureResponderEvent, TransformsStyle } from 'react-native';
import {
  // @ts-ignore
  unstable_createElement as createElement,
} from 'react-native';
import type {
  NumberArray,
  NumberProp,
  TransformProps,
} from './lib/extract/types';
import SvgTouchableMixin from './lib/SvgTouchableMixin';
import { resolve } from './lib/resolve';
import { transformsArrayToProps } from './lib/extract/extractTransform';

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
  forwardedRef?:
    | React.RefCallback<SVGElement>
    | React.MutableRefObject<SVGElement | null>;
  style: Iterable<{}>;

  // different tranform props
  gradientTransform: TransformProps['transform'];
  patternTransform: TransformProps['transform'];
}

const hasTouchableProperty = (props: BaseProps) =>
  props.onPress || props.onPressIn || props.onPressOut || props.onLongPress;

const camelCaseToDashed = (camelCase: string) => {
  return camelCase.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
};

function stringifyTransformProps(transformProps: TransformProps) {
  const transformArray = [];
  if (transformProps.translate != null) {
    transformArray.push(`translate(${transformProps.translate})`);
  }
  if (transformProps.translateX != null || transformProps.translateY != null) {
    transformArray.push(
      `translate(${transformProps.translateX || 0}, ${
        transformProps.translateY || 0
      })`,
    );
  }
  if (transformProps.scale != null) {
    transformArray.push(`scale(${transformProps.scale})`);
  }
  if (transformProps.scaleX != null || transformProps.scaleY != null) {
    transformArray.push(
      `scale(${transformProps.scaleX || 1}, ${transformProps.scaleY || 1})`,
    );
  }
  // rotation maps to rotate, not to collide with the text rotate attribute (which acts per glyph rather than block)
  if (transformProps.rotation != null) {
    transformArray.push(`rotate(${transformProps.rotation})`);
  }
  if (transformProps.skewX != null) {
    transformArray.push(`skewX(${transformProps.skewX})`);
  }
  if (transformProps.skewY != null) {
    transformArray.push(`skewY(${transformProps.skewY})`);
  }
  return transformArray;
}

function parseTransformProp(
  transform: TransformProps['transform'],
  props?: BaseProps,
) {
  const transformArray: string[] = [];

  props && transformArray.push(...stringifyTransformProps(props));

  if (Array.isArray(transform)) {
    if (typeof transform[0] === 'number') {
      transformArray.push(`matrix(${transform.join(' ')})`);
    } else {
      const stringifiedProps = transformsArrayToProps(
        transform as TransformsStyle['transform'],
      );
      transformArray.push(...stringifyTransformProps(stringifiedProps));
    }
  } else if (typeof transform === 'string') {
    transformArray.push(transform);
  }

  return transformArray.length ? transformArray.join(' ') : undefined;
}

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

  const clean: {
    onStartShouldSetResponder?: (e: GestureResponderEvent) => boolean;
    onResponderMove?: (e: GestureResponderEvent) => void;
    onResponderGrant?: (e: GestureResponderEvent) => void;
    onResponderRelease?: (e: GestureResponderEvent) => void;
    onResponderTerminate?: (e: GestureResponderEvent) => void;
    onResponderTerminationRequest?: (e: GestureResponderEvent) => boolean;
    transform?: string;
    gradientTransform?: string;
    patternTransform?: string;
    'transform-origin'?: string;
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

  if (origin != null) {
    clean['transform-origin'] = origin.toString().replace(',', ' ');
  } else if (originX != null || originY != null) {
    clean['transform-origin'] = `${originX || 0} ${originY || 0}`;
  }

  clean.transform = parseTransformProp(transform, props);
  clean.gradientTransform = parseTransformProp(gradientTransform);
  clean.patternTransform = parseTransformProp(patternTransform);

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

/* Taken from here: https://gist.github.com/jennyknuth/222825e315d45a738ed9d6e04c7a88d0 */
function encodeSvg(svgString: string) {
  return svgString
    .replace(
      '<svg',
      ~svgString.indexOf('xmlns')
        ? '<svg'
        : '<svg xmlns="http://www.w3.org/2000/svg"',
    )
    .replace(/"/g, "'")
    .replace(/%/g, '%25')
    .replace(/#/g, '%23')
    .replace(/{/g, '%7B')
    .replace(/}/g, '%7D')
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E')
    .replace(/\s+/g, ' ');
}

export class Svg extends WebShape {
  tag = 'svg' as const;
  toDataURL(
    callback: (data: string) => void,
    options: { width?: number; height?: number } = {},
  ) {
    const ref = this.elementRef.current;

    if (ref == null) {
      return;
    }

    const rect = getBoundingClientRect(ref);

    const width = Number(options.width) || rect.width;
    const height = Number(options.height) || rect.height;

    // @ts-expect-error "DOM" is not part of `compilerOptions.lib`
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
    svg.setAttribute('width', String(width));
    svg.setAttribute('height', String(height));
    // @ts-expect-error "DOM" is not part of `compilerOptions.lib`
    svg.appendChild(ref.cloneNode(true));

    // @ts-expect-error "DOM" is not part of `compilerOptions.lib`
    const img = new window.Image();
    img.onload = () => {
      // @ts-expect-error "DOM" is not part of `compilerOptions.lib`
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d');
      context?.drawImage(img, 0, 0);
      callback(canvas.toDataURL().replace('data:image/png;base64,', ''));
    };

    img.src = `data:image/svg+xml;utf8,${encodeSvg(
      // @ts-expect-error "DOM" is not part of `compilerOptions.lib`
      new window.XMLSerializer().serializeToString(svg),
    )}`;
  }
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

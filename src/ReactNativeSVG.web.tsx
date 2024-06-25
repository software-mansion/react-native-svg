import React, { MutableRefObject, useImperativeHandle, useRef } from 'react';
import type { CircleProps } from './elements/Circle';
import type { ClipPathProps } from './elements/ClipPath';
import type { EllipseProps } from './elements/Ellipse';
import type { ForeignObjectProps } from './elements/ForeignObject';
import type { GProps } from './elements/G';
import type { ImageProps } from './elements/Image';
import type { LineProps } from './elements/Line';
import type { LinearGradientProps } from './elements/LinearGradient';
import type { MarkerProps } from './elements/Marker';
import type { MaskProps } from './elements/Mask';
import type { PathProps } from './elements/Path';
import type { PatternProps } from './elements/Pattern';
import type { PolygonProps } from './elements/Polygon';
import type { PolylineProps } from './elements/Polyline';
import type { RadialGradientProps } from './elements/RadialGradient';
import type { RectProps } from './elements/Rect';
import type { StopProps } from './elements/Stop';
import type { SvgProps } from './elements/Svg';
import type { SymbolProps } from './elements/Symbol';
import type { TextProps } from './elements/Text';
import type { TextPathProps } from './elements/TextPath';
import type { TSpanProps } from './elements/TSpan';
import type { UseProps } from './elements/Use';
import {
  Touchable,
  // @ts-ignore it is not seen in exports
  unstable_createElement as createElement,
} from 'react-native';
import useResponderEvents from 'react-native-web/src/modules/useResponderEvents/index';
import useMergeRefs from 'react-native-web/src/modules/useMergeRefs/index';
import SvgTouchableMixin from './lib/SvgTouchableMixin';
import { BaseProps, CreateComponentProps } from './types';
import {
  camelCaseToDashed,
  hasTouchableProperty,
  prepare,
  remeasure,
} from './utils';

// @ts-expect-error: Mixin is not typed
const { Mixin } = Touchable;
const { touchableGetInitialState } = Mixin;

const WebShape = <T,>(
  props: CreateComponentProps<T>,
  forwardedRef: React.Ref<T | null>
) => {
  const {
    onMoveShouldSetResponder,
    onMoveShouldSetResponderCapture,
    onResponderEnd,
    onResponderGrant,
    onResponderMove,
    onResponderReject,
    onResponderRelease,
    onResponderStart,
    onResponderTerminate,
    onResponderTerminationRequest,
    onScrollShouldSetResponder,
    onScrollShouldSetResponderCapture,
    onSelectionChangeShouldSetResponder,
    onSelectionChangeShouldSetResponderCapture,
    onStartShouldSetResponder,
    onStartShouldSetResponderCapture,
    tag: Tag,
    ...rest
  } = props;

  const elementRef = useRef<T | null>(null);
  const lastMergedProps = useRef<Partial<typeof props>>({});
  const state = useRef(touchableGetInitialState());
  const setRef = useMergeRefs(elementRef, forwardedRef);
  const remeasureMetricsOnActivation = useRef(() => {
    const element = elementRef.current as HTMLElement | null;
    const metrics = remeasure(element);
    if (metrics) {
      console.log('Re-measured metrics:', metrics);
    }
  });

  useResponderEvents(elementRef as MutableRefObject<SVGElement>, {
    onMoveShouldSetResponder,
    onMoveShouldSetResponderCapture,
    onResponderEnd,
    onResponderGrant,
    onResponderMove,
    onResponderReject,
    onResponderRelease,
    onResponderStart,
    onResponderTerminate,
    onResponderTerminationRequest,
    onScrollShouldSetResponder,
    onScrollShouldSetResponderCapture,
    onSelectionChangeShouldSetResponder,
    onSelectionChangeShouldSetResponderCapture,
    onStartShouldSetResponder,
    onStartShouldSetResponderCapture,
  });

  const setNativeProps = (props: { style: typeof rest }) => {
    const merged = Object.assign(
      {},
      rest,
      lastMergedProps.current,
      props.style
    );
    lastMergedProps.current = merged;
    const clean = prepare(merged as any);
    const current = elementRef.current;
    if (current) {
      for (const cleanAttribute of Object.keys(clean)) {
        const cleanValue = clean[cleanAttribute as keyof typeof clean];
        switch (cleanAttribute) {
          case 'ref':
          case 'children':
            break;
          case 'style':
            for (const partialStyle of ([] as unknown[]).concat(
              clean.style ?? []
            )) {
              Object.assign(
                (current as unknown as SVGElement).style,
                partialStyle
              );
            }
            break;
          default:
            (current as unknown as SVGElement).setAttribute(
              camelCaseToDashed(cleanAttribute),
              cleanValue as string
            );
            break;
        }
      }
    }
  };

  useImperativeHandle(forwardedRef, () => ({
    ...(elementRef.current as T & { setNativeProps: typeof setNativeProps }),
    setNativeProps,
    remeasure: remeasureMetricsOnActivation.current,
  }));

  if (hasTouchableProperty(rest as BaseProps)) {
    SvgTouchableMixin({ ...elementRef.current, state: state.current });
  }

  return createElement(Tag, { ...rest, collapsable: undefined, ref: setRef });
};

const CreateComponent = React.forwardRef(WebShape);

const createComponent = <T,>(
  tag: keyof JSX.IntrinsicElements,
  prepareProps?: (props: BaseProps & Omit<T, 'tag'>) => Omit<T, 'tag'>
) => {
  return React.forwardRef<T, Omit<T, 'tag'>>((props, ref) => {
    let createComponentProps = props;
    if (prepareProps) {
      createComponentProps = prepareProps(props);
    }
    return <CreateComponent {...createComponentProps} tag={tag} ref={ref} />;
  });
};

export const Circle = createComponent<BaseProps & CircleProps>('circle');
export const ClipPath = createComponent<BaseProps & ClipPathProps>('clipPath');
export const Defs = createComponent<BaseProps>('defs');
export const Ellipse = createComponent<BaseProps & EllipseProps>('ellipse');

const prepareGProps = (props: BaseProps & GProps) => {
  const { x, y, ...rest } = props;
  if ((x || y) && !rest.translate) {
    rest.transform = `translate(${x || 0}, ${y || 0})`;
  }
  return rest;
};
export const G = createComponent<BaseProps & GProps>('g', prepareGProps);

export const Image = createComponent<BaseProps & ImageProps>('image');
export const Line = createComponent<BaseProps & LineProps>('line');
export const LinearGradient = createComponent<BaseProps & LinearGradientProps>(
  'linearGradient'
);
export const Path = createComponent<BaseProps & PathProps>('path');
export const Polygon = createComponent<BaseProps & PolygonProps>('polygon');
export const Polyline = createComponent<BaseProps & PolylineProps>('polyline');
export const RadialGradient = createComponent<BaseProps & RadialGradientProps>(
  'radialGradient'
);
export const Rect = createComponent<BaseProps & RectProps>('rect');
export const Stop = createComponent<BaseProps & StopProps>('stop');

/* Taken from here: https://gist.github.com/jennyknuth/222825e315d45a738ed9d6e04c7a88d0 */
function encodeSvg(svgString: string) {
  return svgString
    .replace(
      '<svg',
      ~svgString.indexOf('xmlns')
        ? '<svg'
        : '<svg xmlns="http://www.w3.org/2000/svg"'
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

const SvgComponent = createComponent<SvgProps & BaseProps>('svg', (props) => {
  const { x, y, ...rest } = props;

  if ((x || y) && !rest.transform) {
    rest.transform = `translate(${x || 0}, ${y || 0})`;
  }

  return rest;
});

(SvgComponent as SvgProps).toDataURL = (
  svgString: string,
  callback: (data: string) => void,
  options: { width?: number; height?: number } = {}
) => {
  const tempSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  tempSvg.innerHTML = svgString;

  const rect = tempSvg.getBoundingClientRect();
  const width = options.width || rect.width;
  const height = options.height || rect.height;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
  svg.setAttribute('width', String(width));
  svg.setAttribute('height', String(height));
  svg.innerHTML = svgString;

  const img = new window.Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context?.drawImage(img, 0, 0);
    callback(canvas.toDataURL().replace('data:image/png;base64,', ''));
  };

  img.src = `data:image/svg+xml;utf8,${encodeSvg(svgString)}`;
};

export const Svg = SvgComponent;

export const Symbol = createComponent<BaseProps & SymbolProps>('symbol');
export const Text = createComponent<BaseProps & TextProps>('text');
export const TSpan = createComponent<BaseProps & TSpanProps>('tspan');
export const TextPath = createComponent<BaseProps & TextPathProps>('textPath');
export const Use = createComponent<BaseProps & UseProps>('use');
export const Mask = createComponent<BaseProps & MaskProps>('mask');
export const ForeignObject = createComponent<BaseProps & ForeignObjectProps>(
  'foreignObject'
);
export const Marker = createComponent<BaseProps & MarkerProps>('marker');
export const Pattern = createComponent<BaseProps & PatternProps>('pattern');

export default Svg;

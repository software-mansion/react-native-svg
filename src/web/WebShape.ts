import React from 'react';
import {
  GestureResponderEvent,
  // @ts-ignore it is not seen in exports
  unstable_createElement as createElement,
} from 'react-native';

import { BaseProps } from './types';
import { prepare } from './utils/prepare';
import { camelCaseToDashed, hasTouchableProperty, remeasure } from './utils';
import SvgTouchableMixin from '../lib/SvgTouchableMixin';

export class WebShape<
  P extends BaseProps = BaseProps,
> extends React.Component<P> {
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
      props.style
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
            for (const partialStyle of ([] as unknown[]).concat(
              clean.style ?? []
            )) {
              Object.assign(current.style, partialStyle);
            }
            break;
          default:
            // apply all other incoming prop updates as attributes on the node
            // same logic as in https://github.com/software-mansion/react-native-reanimated/blob/d04720c82f5941532991b235787285d36d717247/src/reanimated2/js-reanimated/index.ts#L38-L39
            // @ts-expect-error TODO: fix this
            current.setAttribute(camelCaseToDashed(cleanAttribute), cleanValue);
            break;
        }
      }
    }
  }

  _remeasureMetricsOnActivation: () => void;
  touchableHandleStartShouldSetResponder?: (
    e: GestureResponderEvent
  ) => boolean;

  touchableHandleResponderMove?: (e: GestureResponderEvent) => void;
  touchableHandleResponderGrant?: (e: GestureResponderEvent) => void;
  touchableHandleResponderRelease?: (e: GestureResponderEvent) => void;
  touchableHandleResponderTerminate?: (e: GestureResponderEvent) => void;
  touchableHandleResponderTerminationRequest?: (
    e: GestureResponderEvent
  ) => boolean;

  constructor(props: P) {
    super(props);

    // Do not attach touchable mixin handlers if SVG element doesn't have a touchable prop
    if (hasTouchableProperty(props)) {
      SvgTouchableMixin(this);
    }

    this._remeasureMetricsOnActivation = remeasure.bind(this);
  }

  render(): JSX.Element {
    if (!this.tag) {
      throw new Error(
        'When extending `WebShape` you need to overwrite either `tag` or `render`!'
      );
    }
    this.lastMergedProps = {};
    return createElement(
      this.tag,
      prepare(this, this.prepareProps(this.props))
    );
  }
}

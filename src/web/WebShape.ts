import React, { type JSX } from 'react';
import {
  TouchableWithoutFeedback,
  // @ts-ignore it is not seen in exports
  unstable_createElement as createElement,
} from 'react-native';

import { BaseProps } from './types';
import { prepare } from './utils/prepare';
import { convertInt32ColorToRGBA } from './utils/convertInt32Color';
import { getAttributeName } from './utils';
import { hasTouchableProperty } from './utils/hasProperty';

/**
 * `TouchableWithoutFeedback` clones its child and injects props on it
 * (`focusable`, `accessibilityDisabled` and the responder handlers). Those props
 * need `unstable_createElement` to be turned into DOM attributes, so the child
 * has to be a component that calls it, not an already created element.
 */
const TouchableSvgElement = React.forwardRef<
  SVGElement,
  {
    tag: React.ElementType;
    elementProps: Record<string, unknown>;
    children?: React.ReactNode;
  }
>(({ tag, elementProps, ...injectedProps }, ref) =>
  createElement(tag, { ...elementProps, ...injectedProps, ref })
);

TouchableSvgElement.displayName = 'TouchableSvgElement';

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
          case 'fill':
            if (cleanValue && typeof cleanValue === 'object') {
              const value = cleanValue as { payload: number };
              current.setAttribute(
                'fill',
                convertInt32ColorToRGBA(value.payload)
              );
            }
            break;
          case 'stroke':
            if (cleanValue && typeof cleanValue === 'object') {
              const value = cleanValue as { payload: number };
              current.setAttribute(
                'stroke',
                convertInt32ColorToRGBA(value.payload)
              );
            }
            break;
          default:
            // apply all other incoming prop updates as attributes on the node
            // same logic as in https://github.com/software-mansion/react-native-reanimated/blob/d04720c82f5941532991b235787285d36d717247/src/reanimated2/js-reanimated/index.ts#L38-L39
            // @ts-expect-error TODO: fix this
            current.setAttribute(getAttributeName(cleanAttribute), cleanValue);
            break;
        }
      }
    }
  }

  render(): JSX.Element {
    if (!this.tag) {
      throw new Error(
        'When extending `WebShape` you need to overwrite either `tag` or `render`!'
      );
    }
    this.lastMergedProps = {};

    const cleanProps = prepare(this, this.prepareProps(this.props));

    // Only touchable elements are wrapped, so only they become keyboard
    // focusable. A plain shape stays out of the tab order.
    if (!hasTouchableProperty(this.props)) {
      return createElement(this.tag, cleanProps);
    }

    const { children, ref, ...elementProps } = cleanProps as Record<
      string,
      unknown
    >;

    const {
      delayLongPress,
      delayPressIn,
      delayPressOut,
      disabled,
      focusable,
      onBlur,
      onFocus,
      onLongPress,
      onPress,
      onPressIn,
      onPressOut,
      rejectResponderTermination,
    } = this.props;

    return React.createElement(
      TouchableWithoutFeedback,
      {
        delayLongPress,
        delayPressIn,
        delayPressOut,
        disabled,
        // A touchable element is a keyboard tab stop unless it opts out with
        // `focusable={false}`.
        focusable,
        onBlur,
        onFocus,
        onLongPress,
        onPress,
        onPressIn,
        onPressOut,
        rejectResponderTermination,
      },
      React.createElement(
        TouchableSvgElement,
        {
          tag: this.tag,
          elementProps,
          // TouchableWithoutFeedback merges this ref with its own host ref
          ref: ref as React.Ref<SVGElement>,
        },
        children as React.ReactNode
      )
    );
  }
}

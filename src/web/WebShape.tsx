import React, {
  MutableRefObject,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import {
  // @ts-ignore it is not seen in exports
  unstable_createElement as createElement,
} from 'react-native';
// eslint-disable-next-line import/no-unresolved
import useResponderEvents from 'react-native-web/src/modules/useResponderEvents/index';
// eslint-disable-next-line import/no-unresolved
import useMergeRefs from 'react-native-web/src/modules/useMergeRefs/index';
// eslint-disable-next-line import/no-unresolved
import usePressEvents from 'react-native-web/src/modules/usePressEvents/index';
import { CreateComponentProps } from '../types';
import {
  camelCaseToDashed,
  hasTouchableProperty,
  prepare,
  remeasure,
} from '../utils';

export const WebShape = <T,>(
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
    onPress,
    onLongPress,
    onPressIn,
    onPressOut,
    tag: Tag,
    ...rest
  } = props;

  const elementRef = useRef<T | null>(null);
  const lastMergedProps = useRef<Partial<typeof props>>({});
  const remeasureMetricsOnActivation = useRef(() => {
    const element = elementRef.current as HTMLElement | null;
    const metrics = remeasure(element);
    if (metrics) {
      console.log('Re-measured metrics:', metrics);
    }
  });

  const setNativeProps = (nativeProps: { style: typeof rest }) => {
    const merged = Object.assign(
      {},
      rest,
      lastMergedProps.current,
      nativeProps.style
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

  let pressEventHandlers = {};
  if (hasTouchableProperty(props)) {
    const pressConfig = useMemo(
      () => ({
        onPress,
        onLongPress,
        onPressStart: onPressIn,
        onPressEnd: onPressOut,
      }),
      [onPress, onLongPress, onPressIn, onPressOut]
    );

    pressEventHandlers = usePressEvents(elementRef, pressConfig);

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
  }

  const setRef = useMergeRefs(elementRef, lastMergedProps, forwardedRef);

  return createElement(Tag, {
    ...{
      ...rest,
      ...pressEventHandlers,
      collapsable: undefined,
    },
    ref: setRef,
  });
};

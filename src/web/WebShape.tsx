import React, { useImperativeHandle, useRef } from 'react';
import {
  // @ts-ignore it is not seen in exports
  unstable_createElement as createElement,
} from 'react-native';
// eslint-disable-next-line import/no-unresolved
import useMergeRefs from 'react-native-web/src/modules/useMergeRefs/index';
import { CreateComponentProps } from '../types';
import { camelCaseToDashed, prepare, remeasure } from '../utils';
import { useHandleEvents } from './hooks/useHandleEvents';

export const WebShape = <T,>(
  props: CreateComponentProps,
  forwardedRef: React.Ref<T | null>
) => {
  const { tag: Tag } = props;
  const currentRef = useRef<T | null>(null);
  const { elementRef, rest, onClick } = useHandleEvents<T>(currentRef, props);
  const lastMergedProps = useRef<Partial<typeof rest>>({});

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

  const setRef = useMergeRefs(elementRef, lastMergedProps, forwardedRef);
  return createElement(Tag, {
    ...{
      ...prepare(rest),
      collapsable: undefined,
    },
    onClick,
    ref: setRef,
  });
};

import React, { useLayoutEffect, useRef } from 'react';
import {
  // @ts-ignore it is not seen in exports
  unstable_createElement as createElement,
} from 'react-native';
// eslint-disable-next-line import/no-unresolved
import useMergeRefs from 'react-native-web/src/modules/useMergeRefs/index';
import { BaseProps, CreateComponentProps } from '../types';
import { camelCaseToDashed, prepare } from '../utils';
import { useHandleEvents } from './hooks/useHandleEvents';

export const WebShape = <T,>(
  props: CreateComponentProps,
  forwardedRef: React.Ref<T | null>
) => {
  const { tag: Tag } = props;
  const currentRef = useRef<T | null>(null);
  const { elementRef, rest, onClick } = useHandleEvents(currentRef, props);
  const lastMergedProps = useRef<Partial<typeof rest>>({});

  const setNativeProps = (
    nativeProps: BaseProps,
    elementRef: React.MutableRefObject<SVGElement | null>
  ) => {
    const { style, ...rest } = nativeProps;
    if (elementRef.current) {
      const current = elementRef.current;

      // Set attributes and styles
      Object.keys(rest).forEach((cleanAttribute) => {
        const cleanValue = rest[cleanAttribute as keyof typeof rest];
        switch (cleanAttribute) {
          case 'ref':
          case 'children':
            break;
          case 'style':
            Object.assign(current.style, cleanValue);
            break;
          default:
            (current as unknown as SVGElement).setAttribute(
              camelCaseToDashed(cleanAttribute),
              String(cleanValue)
            );
            break;
        }
      });

      const mergedProps = { ...rest, style };
      const mergedStyle = Array.isArray(style)
        ? Object.assign({}, ...style)
        : style;
      const merged = { ...mergedProps, style: mergedStyle };
      lastMergedProps.current = merged;
    }
  };

  useLayoutEffect(() => {
    setNativeProps(
      props,
      elementRef as React.MutableRefObject<SVGElement | null>
    );
  }, [props]);

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

import React, { useRef } from 'react';
import {
  // @ts-ignore it is not seen in exports
  unstable_createElement as createElement,
} from 'react-native';
// @ts-ignore not exported by react-native-web
// eslint-disable-next-line import/no-unresolved
import useMergeRefs from 'react-native-web/dist/modules/useMergeRefs';
import { type CreateComponentProps } from '../types';
import { prepare } from './utils/utils';
import { useHandleEvents } from './hooks/useHandleEvents';
import { setNativeProps } from './utils/setNativeProps';

export const WebShape = <T,>(
  props: CreateComponentProps,
  forwardedRef: React.Ref<T | null>
) => {
  const { tag: Tag } = props;
  const currentRef = useRef<T | null>(null);
  const { elementRef, rest, onClick } = useHandleEvents(currentRef, props);
  const lastMergedProps = useRef<Partial<typeof rest>>({});

  setNativeProps(
    rest,
    elementRef as React.MutableRefObject<SVGElement | null>,
    lastMergedProps
  );

  const setRef = useMergeRefs(elementRef, forwardedRef);
  return createElement(Tag, {
    ...prepare(rest),
    ref: setRef,
    collapsable: undefined,
    onClick,
  });
};

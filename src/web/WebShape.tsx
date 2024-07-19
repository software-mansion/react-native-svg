import React, { useLayoutEffect, useRef } from 'react';
import {
  // @ts-ignore it is not seen in exports
  unstable_createElement as createElement,
} from 'react-native';
// eslint-disable-next-line import/no-unresolved
import useMergeRefs from 'react-native-web/src/modules/useMergeRefs';
import { type CreateComponentProps } from '../types';
import { prepare } from '../utils';
import { useHandleEvents } from './hooks/useHandleEvents';
import { setNativeProps } from './utils';

export const WebShape = <T,>(
  props: CreateComponentProps,
  forwardedRef: React.Ref<T | null>
) => {
  const { tag: Tag } = props;
  const currentRef = useRef<T | null>(null);
  const { elementRef, rest, onClick } = useHandleEvents(currentRef, props);
  const lastMergedProps = useRef<Partial<typeof rest>>({});

  useLayoutEffect(() => {
    setNativeProps(
      props,
      elementRef as React.MutableRefObject<SVGElement | null>,
      lastMergedProps
    );
  }, [props]);

  const setRef = useMergeRefs(elementRef, forwardedRef);
  return createElement(Tag, {
    ...{ ...prepare(rest), ref: setRef },
    collapsable: undefined,
    onClick,
  });
};

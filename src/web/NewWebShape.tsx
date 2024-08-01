import React from 'react';
import {
  StyleProp,
  ViewProps,
  ViewStyle,
  // @ts-ignore it is not seen in exports
  unstable_createElement as createElement,
} from 'react-native';
// @ts-ignore not exported by react-native-web
import useMergeRefs from 'react-native-web/dist/modules/useMergeRefs';
import { type CreateComponentProps } from '../types';
import { prepare } from '../utils';
// import { useHandleEvents } from './hooks/useHandleEvents';
// import { setNativeProps } from './utils';

// @ts-ignore not exported by react-native-web
import * as forwardedProps from 'react-native-web/dist/modules/forwardedProps';
// @ts-ignore not exported by react-native-web
import pick from 'react-native-web/dist/modules/pick';
// @ts-ignore not exported by react-native-web
import useElementLayout from 'react-native-web/dist/modules/useElementLayout';
// @ts-ignore not exported by react-native-web
import useResponderEvents from 'react-native-web/dist/modules/useResponderEvents';
// @ts-ignore not exported by react-native-web
import usePlatformMethods from 'react-native-web/dist/modules/usePlatformMethods';

const forwardPropsList = {
  ...forwardedProps.defaultProps,
  ...forwardedProps.accessibilityProps,
  ...forwardedProps.clickProps,
  ...forwardedProps.focusProps,
  ...forwardedProps.keyboardProps,
  ...forwardedProps.mouseProps,
  ...forwardedProps.touchProps,
  ...forwardedProps.styleProps,
};

const pickProps = (props: ViewProps) => pick(props, forwardPropsList);

export const NewWebShape = <T,>(
  props: CreateComponentProps,
  forwardedRef: React.Ref<T | null>
) => {
  const { tag: Tag } = props;
  // const currentRef = useRef<T | null>(null);
  // const { elementRef, rest, onClick } = useHandleEvents(currentRef, props);
  // const lastMergedProps = useRef<Partial<typeof rest>>({});

  // useLayoutEffect(() => {
  //   setNativeProps(
  //     props,
  //     elementRef as React.MutableRefObject<SVGElement | null>,
  //     lastMergedProps
  //   );
  // }, [props]);

  // const setRef = useMergeRefs(elementRef, forwardedRef);

  const {
    onLayout,
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
    onStartShouldSetResponder,
    onStartShouldSetResponderCapture,
    ...finalProps
  } = props;

  const finalContainerProps = pickProps({
    ...finalProps,
    children: Tag,
    style: prepare(props) as unknown as StyleProp<ViewStyle>,
  });

  const hostRef = React.useRef<HTMLDivElement>(null);
  useElementLayout(hostRef, onLayout);
  const responderConfig = React.useMemo(
    () => ({
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
      onStartShouldSetResponder,
      onStartShouldSetResponderCapture,
    }),
    [
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
      onStartShouldSetResponder,
      onStartShouldSetResponderCapture,
    ]
  );
  useResponderEvents(hostRef, responderConfig);

  const platformMethodsRef = usePlatformMethods(finalContainerProps);

  const setRef = useMergeRefs(hostRef, platformMethodsRef, forwardedRef);
  finalContainerProps.ref = setRef;
  console.log(finalContainerProps, 'finalContainerProps');
  return createElement('svg', finalContainerProps);
};

import { MutableRefObject, useMemo } from 'react';
// eslint-disable-next-line import/no-unresolved, @typescript-eslint/ban-ts-comment
// @ts-ignore
import usePressEvents from 'react-native-web/dist/modules/usePressEvents';
// import usePressEvents from './usePressEvents';
// eslint-disable-next-line import/no-unresolved, @typescript-eslint/ban-ts-comment
// @ts-ignore
import useResponderEvents from 'react-native-web/dist/modules/useResponderEvents';
// import useResponderEvents from './useResponderEvents';
import { hasResponderEvents, hasTouchableProperty } from '../utils/hasProperty';
import { CreateComponentProps } from '../../types';
import { EventHandlers } from './usePressEvents/PressResponder';

export function useHandleEvents<T>(
  elementRef: MutableRefObject<T | null>,
  props: CreateComponentProps
) {
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
    onPressMove,
    delayPressIn,
    delayPressOut,
    delayLongPress,
    ...rest
  } = props;

  let pressEventHandlers: EventHandlers | null = null;
  if (hasTouchableProperty(props)) {
    const pressConfig = useMemo(
      () => ({
        onLongPress,
        onPress,
        onPressMove,
        delayLongPress,
        delayPressStart: delayPressIn,
        delayPressEnd: delayPressOut,
        onPressStart: onPressIn,
        onPressEnd: onPressOut,
      }),
      [
        delayPressIn,
        delayPressOut,
        onLongPress,
        delayLongPress,
        onPress,
        onPressIn,
        onPressOut,
      ]
    );
    pressEventHandlers = usePressEvents(elementRef, pressConfig);
    useResponderEvents(elementRef, pressEventHandlers);
  } else if (hasResponderEvents(props)) {
    useResponderEvents(elementRef, {
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
  return {
    elementRef,
    rest,
    onClick: pressEventHandlers?.onClick,
  };
}

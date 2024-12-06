import { MutableRefObject, useMemo } from 'react';
import { usePressEvents, useResponderEvents } from '../webUtils.web';
import { hasResponderEvents, hasTouchableProperty } from '../utils/hasProperty';
import type { CreateComponentProps } from '../../types';
import { EventHandlers } from './types';

export function useHandleEvents(
  elementRef: MutableRefObject<SVGElement | null>,
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

  let pressEventHandlers: EventHandlers | undefined;
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

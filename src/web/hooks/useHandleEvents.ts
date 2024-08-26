import { MutableRefObject, useMemo } from 'react';
// @ts-ignore not exported by react-native-web
// eslint-disable-next-line import/no-unresolved
import usePressEvents from 'react-native-web/dist/modules/usePressEvents';
// @ts-ignore not exported by react-native-web
// eslint-disable-next-line import/no-unresolved
import useResponderEvents from 'react-native-web/dist/modules/useResponderEvents';
import { hasResponderEvents, hasTouchableProperty } from '../utils/hasProperty';
import { CreateComponentProps } from '../../types';

type ClickEvent = any;
type KeyboardEvent = any;
type ResponderEvent = any;

// https://github.com/necolas/react-native-web/blob/54c14d64dabd175e8055e1dc92e9196c821f9b7d/packages/react-native-web/src/modules/usePressEvents/PressResponder.js#L44-L54
export type EventHandlers = Readonly<{
  onClick: (event: ClickEvent) => void;
  onContextMenu: (event: ClickEvent) => void;
  onKeyDown: (event: KeyboardEvent) => void;
  onResponderGrant: (event: ResponderEvent) => void;
  onResponderMove: (event: ResponderEvent) => void;
  onResponderRelease: (event: ResponderEvent) => void;
  onResponderTerminate: (event: ResponderEvent) => void;
  onResponderTerminationRequest: (event: ResponderEvent) => boolean;
  onStartShouldSetResponder: (event: ResponderEvent) => boolean;
}>;

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

import { MutableRefObject, useMemo } from 'react';
// eslint-disable-next-line import/no-unresolved
import usePressEvents from 'react-native-web/src/modules/usePressEvents/index';
// eslint-disable-next-line import/no-unresolved
import useResponderEvents from 'react-native-web/src/modules/useResponderEvents/index';
import { hasTouchableProperty } from '../../utils';
import { CreateComponentProps } from '../../types';

export function useHandleEvents<T>(
  elementRef: MutableRefObject<T | null>,
  props: CreateComponentProps<T>
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
    // onPressMove,
  } = props;
  console.log(hasTouchableProperty(props), 'hasTouchableProperty(props)');
  if (hasTouchableProperty(props)) {
    console.log('here ');
    let pressEventHandlers = {};
    const pressConfig = useMemo(
      () => ({
        onLongPress,
        onPress,
        onPressStart: onPressIn,
        // onPressMove,
        onPressEnd: onPressOut,
      }),
      [onLongPress, onPress, onPressIn, onPressOut]
    );

    pressEventHandlers = usePressEvents(elementRef, pressConfig);
    console.log(pressEventHandlers, 'pressEventHandlers');
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
      ...pressEventHandlers,
    });
  }

  return elementRef;
}

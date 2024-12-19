import { BaseProps } from '../../types';

export function hasTouchableProperty(props: BaseProps): boolean {
  return !!(
    props.onPress ||
    props.onPressIn ||
    props.onPressOut ||
    props.onLongPress
  );
}

export function hasResponderEvents(props: BaseProps): boolean {
  const responderEvents = [
    'onResponderGrant',
    'onResponderMove',
    'onResponderRelease',
    'onResponderTerminate',
    'onResponderTerminationRequest',
    'onMoveShouldSetResponder',
    'onMoveShouldSetResponderCapture',
    'onResponderEnd',
    'onResponderReject',
    'onResponderStart',
    'onScrollShouldSetResponder',
    'onScrollShouldSetResponderCapture',
    'onSelectionChangeShouldSetResponder',
    'onSelectionChangeShouldSetResponderCapture',
    'onStartShouldSetResponder',
    'onStartShouldSetResponderCapture',
  ];

  return responderEvents.some((event) => !!props[event as keyof BaseProps]);
}

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
  return !!(
    props.onResponderGrant ||
    props.onResponderMove ||
    props.onResponderRelease ||
    props.onResponderTerminate ||
    props.onResponderTerminationRequest ||
    props.onMoveShouldSetResponder ||
    props.onMoveShouldSetResponderCapture ||
    props.onResponderEnd ||
    props.onResponderReject ||
    props.onResponderStart ||
    props.onScrollShouldSetResponder ||
    props.onScrollShouldSetResponderCapture ||
    props.onSelectionChangeShouldSetResponder ||
    props.onSelectionChangeShouldSetResponderCapture ||
    props.onStartShouldSetResponder ||
    props.onStartShouldSetResponderCapture
  );
}

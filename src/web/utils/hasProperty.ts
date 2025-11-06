import type { BaseProps } from '../types';

export function hasTouchableProperty(props: BaseProps): boolean {
  return !!(
    props.onPress ||
    props.onPressIn ||
    props.onPressOut ||
    props.onLongPress
  );
}

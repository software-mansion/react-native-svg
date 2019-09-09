// @ts-ignore
import { Touchable, GestureResponderEvent } from 'react-native';
const PRESS_RETENTION_OFFSET = { top: 20, left: 20, right: 20, bottom: 30 };
// @ts-ignore
const { Mixin } = Touchable;
const {
  touchableHandleStartShouldSetResponder,
  touchableHandleResponderTerminationRequest,
  touchableHandleResponderGrant,
  touchableHandleResponderMove,
  touchableHandleResponderRelease,
  touchableHandleResponderTerminate,
} = Mixin;

export default {
  ...Mixin,

  touchableHandleStartShouldSetResponder: function(e: GestureResponderEvent) {
    const { onStartShouldSetResponder } = this.props;
    if (onStartShouldSetResponder) {
      return onStartShouldSetResponder(e);
    } else {
      return touchableHandleStartShouldSetResponder.call(this, e);
    }
  },

  touchableHandleResponderTerminationRequest: function(
    e: GestureResponderEvent,
  ) {
    const { onResponderTerminationRequest } = this.props;
    if (onResponderTerminationRequest) {
      return onResponderTerminationRequest(e);
    } else {
      return touchableHandleResponderTerminationRequest.call(this, e);
    }
  },

  touchableHandleResponderGrant: function(e: GestureResponderEvent) {
    const { onResponderGrant } = this.props;
    if (onResponderGrant) {
      return onResponderGrant(e);
    } else {
      return touchableHandleResponderGrant.call(this, e);
    }
  },

  touchableHandleResponderMove: function(e: GestureResponderEvent) {
    const { onResponderMove } = this.props;
    if (onResponderMove) {
      return onResponderMove(e);
    } else {
      return touchableHandleResponderMove.call(this, e);
    }
  },

  touchableHandleResponderRelease: function(e: GestureResponderEvent) {
    const { onResponderRelease } = this.props;
    if (onResponderRelease) {
      return onResponderRelease(e);
    } else {
      return touchableHandleResponderRelease.call(this, e);
    }
  },

  touchableHandleResponderTerminate: function(e: GestureResponderEvent) {
    const { onResponderTerminate } = this.props;
    if (onResponderTerminate) {
      return onResponderTerminate(e);
    } else {
      return touchableHandleResponderTerminate.call(this, e);
    }
  },

  touchableHandlePress: function(e: GestureResponderEvent) {
    const { onPress } = this.props;
    onPress && onPress(e);
  },

  touchableHandleActivePressIn: function(e: GestureResponderEvent) {
    const { onPressIn } = this.props;
    onPressIn && onPressIn(e);
  },

  touchableHandleActivePressOut: function(e: GestureResponderEvent) {
    const { onPressOut } = this.props;
    onPressOut && onPressOut(e);
  },

  touchableHandleLongPress: function(e: GestureResponderEvent) {
    const { onLongPress } = this.props;
    onLongPress && onLongPress(e);
  },

  touchableGetPressRectOffset: function() {
    const { pressRetentionOffset } = this.props;
    return pressRetentionOffset || PRESS_RETENTION_OFFSET;
  },

  touchableGetHitSlop: function() {
    const { hitSlop } = this.props;
    return hitSlop;
  },

  touchableGetHighlightDelayMS: function() {
    const { delayPressIn } = this.props;
    return delayPressIn || 0;
  },

  touchableGetLongPressDelayMS: function() {
    const { delayLongPress } = this.props;
    return delayLongPress === 0 ? 0 : delayLongPress || 500;
  },

  touchableGetPressOutDelayMS: function() {
    const { delayPressOut } = this.props;
    return delayPressOut || 0;
  },
};

import { Touchable } from "react-native";
const PRESS_RETENTION_OFFSET = { top: 20, left: 20, right: 20, bottom: 30 };

//noinspection JSUnusedGlobalSymbols
export default {
    ...Touchable.Mixin,

    touchableHandleStartShouldSetResponder: function(e) {
        if (this.props.onStartShouldSetResponder) {
            return this.props.onStartShouldSetResponder(e);
        } else {
            return Touchable.Mixin.touchableHandleStartShouldSetResponder.call(
                this,
                e
            );
        }
    },

    touchableHandleResponderTerminationRequest: function(e) {
        if (this.props.onResponderTerminationRequest) {
            return this.props.onResponderTerminationRequest(e);
        } else {
            return Touchable.Mixin.touchableHandleResponderTerminationRequest.call(
                this,
                e
            );
        }
    },

    touchableHandleResponderGrant: function(e) {
        if (this.props.onResponderGrant) {
            return this.props.onResponderGrant(e);
        } else {
            return Touchable.Mixin.touchableHandleResponderGrant.call(this, e);
        }
    },

    touchableHandleResponderMove: function(e) {
        if (this.props.onResponderMove) {
            return this.props.onResponderMove(e);
        } else {
            return Touchable.Mixin.touchableHandleResponderMove.call(this, e);
        }
    },

    touchableHandleResponderRelease: function(e) {
        if (this.props.onResponderRelease) {
            return this.props.onResponderRelease(e);
        } else {
            return Touchable.Mixin.touchableHandleResponderRelease.call(
                this,
                e
            );
        }
    },

    touchableHandleResponderTerminate: function(e) {
        if (this.props.onResponderTerminate) {
            return this.props.onResponderTerminate(e);
        } else {
            return Touchable.Mixin.touchableHandleResponderTerminate.call(
                this,
                e
            );
        }
    },

    touchableHandlePress: function(e) {
        this.props.onPress && this.props.onPress(e);
    },

    touchableHandleActivePressIn: function(e) {
        this.props.onPressIn && this.props.onPressIn(e);
    },

    touchableHandleActivePressOut: function(e) {
        this.props.onPressOut && this.props.onPressOut(e);
    },

    touchableHandleLongPress: function(e) {
        this.props.onLongPress && this.props.onLongPress(e);
    },

    touchableGetPressRectOffset: function() {
        return this.props.pressRetentionOffset || PRESS_RETENTION_OFFSET;
    },

    touchableGetHitSlop: function() {
        return this.props.hitSlop;
    },

    touchableGetHighlightDelayMS: function() {
        return this.props.delayPressIn || 0;
    },

    touchableGetLongPressDelayMS: function() {
        return this.props.delayLongPress === 0
            ? 0
            : this.props.delayLongPress || 500;
    },

    touchableGetPressOutDelayMS: function() {
        return this.props.delayPressOut || 0;
    }
};

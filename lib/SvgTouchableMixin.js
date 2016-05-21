import Touchable from 'react-native/Libraries/Components/Touchable/Touchable';
const PRESS_RETENTION_OFFSET = {top: 20, left: 20, right: 20, bottom: 30};

export default {
    ...Touchable.Mixin,
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
        return this.props.delayLongPress === 0 ? 0 :
        this.props.delayLongPress || 500;
    },

    touchableGetPressOutDelayMS: function() {
        return this.props.delayPressOut || 0;
    }
};

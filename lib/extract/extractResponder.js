import { PanResponder } from "react-native";
import _ from "lodash";

const responderProps = [
    ...Object.keys(PanResponder.create({}).panHandlers),
    "pointerEvents"
];

const touchableProps = [
    "disabled",
    "onPress",
    "onPressIn",
    "onPressOut",
    "onLongPress",
    "delayPressIn",
    "delayPressOut",
    "delayLongPress",
];

export default function(props, ref) {
    const extractedProps = {};

    _.forEach(responderProps, (key) => {
        const value = props[key];
        if (props[key]) {
            if (!extractedProps.responsible && key !== "pointerEvents") {
                extractedProps.responsible = true;
            }

            extractedProps[key] = value;
        }
    });

    _.every(touchableProps, (key) => {
        if (!props[key]) {
            return true;
        }

        extractedProps.responsible = true;
        Object.assign(extractedProps, {
            onStartShouldSetResponder:
                ref.touchableHandleStartShouldSetResponder,
            onResponderTerminationRequest:
                ref.touchableHandleResponderTerminationRequest,
            onResponderGrant: ref.touchableHandleResponderGrant,
            onResponderMove: ref.touchableHandleResponderMove,
            onResponderRelease: ref.touchableHandleResponderRelease,
            onResponderTerminate: ref.touchableHandleResponderTerminate,
        });

        return false;
    });

    return extractedProps;
}

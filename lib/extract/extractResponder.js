import { PanResponder } from "react-native";

const responderProps = [
    ...Object.keys(PanResponder.create({}).panHandlers),
    "pointerEvents",
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

function hasTouchableProperty(props) {
    for (const prop of touchableProps) {
        if (props.hasOwnProperty(prop)) {
            return true;
        }
    }
    return false;
}

export default function extractResponder(props, ref) {
    const extractedProps = {};

    for (const key of responderProps) {
        const value = props[key];
        if (props[key]) {
            if (!extractedProps.responsible && key !== "pointerEvents") {
                extractedProps.responsible = true;
            }

            extractedProps[key] = value;
        }
    }

    if (hasTouchableProperty(props)) {
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
    }

    return extractedProps;
}

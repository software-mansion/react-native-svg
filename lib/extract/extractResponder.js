import { PanResponder } from "react-native";

const responderProps = [
    ...Object.keys(PanResponder.create({}).panHandlers),
    "pointerEvents",
];
const numResponderProps = responderProps.length;

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
const numTouchableProps = touchableProps.length;

function hasTouchableProperty(props) {
    for (let i = 0; i < numTouchableProps; i++) {
        if (props.hasOwnProperty(touchableProps[i])) {
            return true;
        }
    }
    return false;
}

export default function extractResponder(props, ref) {
    const extractedProps = {};

    for (let i = 0; i < numResponderProps; i++) {
        const key = responderProps[i];
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

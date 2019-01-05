import { PanResponder } from "react-native";

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

    for (let key of responderProps) {
        const value = props[key];
        if (props[key]) {
            if (!extractedProps.responsible && key !== "pointerEvents") {
                extractedProps.responsible = true;
            }

            extractedProps[key] = value;
        }
    }

    if (touchableProps.some(key => props[key])) {
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

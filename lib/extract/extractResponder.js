import { responderProps, touchableProps } from "../props";
import _ from "lodash";

export default function(props, ref) {
    const extractedProps = {};

    _.forEach(responderProps, (v, key) => {
        const value = props[key];
        if (props[key]) {
            if (!extractedProps.responsible && key !== "pointerEvents") {
                extractedProps.responsible = true;
            }

            extractedProps[key] = value;
        }
    });

    _.every(touchableProps, (v, key) => {
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
            onResponderTerminate: ref.touchableHandleResponderTerminate
        });

        return false;
    });

    return extractedProps;
}

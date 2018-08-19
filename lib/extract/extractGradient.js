import { Children } from "react";
import _ from "lodash";
import Color from "color";

import extractOpacity from "./extractOpacity";
import extractTransform from "./extractTransform";
import PATTERN_UNITS from "../PATTERN_UNITS";
import percentToFloat from "../percentToFloat";
import Stop from "../../elements/Stop";

export default function(props) {
    if (!props.id) {
        return null;
    }

    const stops = {};
    Children.forEach(props.children, child => {
        if (child.props.stopColor && child.props.offset) {
            // convert percent to float.
            let offset = percentToFloat(child.props.offset);

            // add stop
            //noinspection JSUnresolvedFunction
            stops[offset] = Color(child.props.stopColor).alpha(
                extractOpacity(child.props.stopOpacity)
            );
        }
    });

    const sorted = _.sortBy(
        _.map(stops, (stop, offset) => {
            return { stop, offset };
        }),
        "offset"
    );

    const gradient = [];

    sorted.forEach(({ stop }) => {
        let [r, g, b, a = 1] = stop.rgb().array();
        gradient.push(r / 255);
        gradient.push(g / 255);
        gradient.push(b / 255);
        gradient.push(a);
    });

    gradient.push(...sorted.map(({ offset }) => +offset));

    let gradientTransform;
    if (props.gradientTransform) {
        gradientTransform = extractTransform(props.gradientTransform);
    } else if (props.transform) {
        gradientTransform = extractTransform(props.transform);
    } else {
        gradientTransform = extractTransform(props);
    }

    return {
        gradient,
        name: props.id,
        gradientTransform,
        gradientUnits: PATTERN_UNITS[props.gradientUnits] || 0
    };
}

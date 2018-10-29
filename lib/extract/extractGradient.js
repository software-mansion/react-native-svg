import { Children } from "react";
import _ from "lodash";
import Color from "color";

import extractOpacity from "./extractOpacity";
import extractTransform from "./extractTransform";
import units from "../units";

const percentReg = /^([+\-]?\d+(?:\.\d+)?(?:[eE][+\-]?\d+)?)(%?)$/;

function percentToFloat(percent) {
    if (typeof percent === 'number') {
        return percent;
    }
    const matched = percent.match(percentReg);
    if (!matched) {
        console.warn(
            `\`${percent}\` is not a valid number or percentage string.`,
        );
        return 0;
    }

    return matched[2] ? matched[1] / 100 : +matched[1];
}

export default function(props) {
    if (!props.id) {
        return null;
    }

    const stops = {};
    Children.forEach(props.children, ({
        props: {
            offset,
            stopColor,
            stopOpacity,
        }
    }) => {
        offset = percentToFloat(offset);
        if (stopColor && !isNaN(offset)) {
            //noinspection JSUnresolvedFunction
            stops[offset] = Color(stopColor).alpha(
                extractOpacity(stopOpacity),
            );
        }
    });

    const sorted = _.sortBy(
        _.map(stops, (stop, offset) => {
            return { stop, offset };
        }),
        "offset",
    );

    const gradient = [];

    sorted.forEach(({ stop }) => {
        const [r, g, b, a = 1] = stop.rgb().array();
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
        gradientUnits: units[props.gradientUnits] || 0,
    };
}

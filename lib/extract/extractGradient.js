import { Children } from "react";
import Color from "color";

import extractOpacity from "./extractOpacity";
import extractTransform from "./extractTransform";
import units from "../units";

const percentReg = /^([+\-]?\d+(?:\.\d+)?(?:[eE][+\-]?\d+)?)(%?)$/;

function percentToFloat(percent) {
    if (typeof percent === "number") {
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

function compareAscending(value, other) {
    if (value !== other) {
        if (value > other) {
            return 1;
        }
        if (value < other) {
            return -1;
        }
    }
    return 0;
}

const offsetComparator = (object, other) => compareAscending(object.offset, other.offset);

export default function(props) {
    if (!props.id) {
        return null;
    }

    const stops = [];
    Children.forEach(
        props.children,
        ({ props: { offset, stopColor, stopOpacity } }) => {
            offset = percentToFloat(offset);
            if (stopColor && !isNaN(offset)) {
                //noinspection JSUnresolvedFunction
                stops.push({
                    stop: Color(stopColor).alpha(extractOpacity(stopOpacity)),
                    offset,
                });
            }
        },
    );
    stops.sort(offsetComparator);

    const gradient = [];

    stops.forEach(({ stop }) => {
        const [r, g, b, a = 1] = stop.rgb().array();
        gradient.push(r / 255);
        gradient.push(g / 255);
        gradient.push(b / 255);
        gradient.push(a);
    });

    gradient.push(...stops.map(({ offset }) => offset));

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

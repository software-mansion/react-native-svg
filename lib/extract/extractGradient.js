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
            `"${percent}" is not a valid number or percentage string.`,
        );
        return 0;
    }

    return matched[2] ? matched[1] / 100 : +matched[1];
}

const offsetComparator = (object, other) => object[0] - other[0];

export default function extractGradient(props) {
    const { id, children, gradientTransform, transform, gradientUnits } = props;
    if (!id) {
        return null;
    }

    const stops = [];
    for (const child of Children.toArray(children)) {
        const { props: { offset, stopColor, stopOpacity } } = child;
        const offsetNumber = percentToFloat(offset);
        if (stopColor && !isNaN(offsetNumber)) {
            const color = Color(stopColor).alpha(extractOpacity(stopOpacity));
            const [r, g, b, a = 1] = color.rgb().array();
            stops.push([offsetNumber, [r / 255, g / 255, b / 255, a]]);
        }
    }
    stops.sort(offsetComparator);

    const gradient = [];
    for (const stop of stops) {
        gradient.push(...stop[1]);
    }
    for (const stop of stops) {
        gradient.push(stop[0]);
    }

    return {
        gradient,
        name: id,
        gradientUnits: units[gradientUnits] || 0,
        gradientTransform: extractTransform(gradientTransform || transform || props),
    };
}

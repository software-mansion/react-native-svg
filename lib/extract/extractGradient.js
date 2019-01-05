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

const offsetComparator = (object, other) => object[0] - other[0];

export default function(props) {
    const { id, children, gradientTransform, transform, gradientUnits } = props;
    if (!id) {
        return null;
    }

    const stops = [];
    for (let child of Children.toArray(children)) {
        const { props: { offset, stopColor, stopOpacity } } = child;
        const offsetNumber = percentToFloat(offset);
        if (stopColor && !isNaN(offsetNumber)) {
            //noinspection JSUnresolvedFunction
            const color = Color(stopColor).alpha(extractOpacity(stopOpacity));
            const [r, g, b, a = 1] = color.rgb().array();
            stops.push([offsetNumber, [r / 255, g / 255, b / 255, a]]);
        }
    }
    stops.sort(offsetComparator);

    const gradient = [];
    for (let stop of stops) {
        gradient.push(...stop[1]);
    }
    for (let stop of stops) {
        gradient.push(stop[0]);
    }

    const gt = extractTransform(gradientTransform || transform || props);

    return {
        gradient,
        name: id,
        gradientTransform: gt,
        gradientUnits: units[gradientUnits] || 0,
    };
}

import rgba from './rgba';
import extractBrush from './extractBrush';
let separator = /\s*,\s*/;

const caps = {
    butt: 0,
    square: 2,
    round: 1
};

const joins = {
    miter: 0,
    bevel: 2,
    round: 1
};

function strokeFilter(props) {
    if (!props.stroke && !props.strokeLinecap && !props.strokeOpacity &&
        !props.strokeLinejoin && !props.strokeDasharray && !props.strokeWidth) {
        return null;
    }

    let strokeDasharray = props.strokeDasharray;

    if (typeof strokeDasharray === 'string') {
        strokeDasharray = strokeDasharray.split(separator).map(dash => +dash);
    }

    return {
        stroke: rgba(props.stroke, props.strokeOpacity).rgbaArray(),
        strokeLinecap: caps[props.strokeLinecap] || 2,
        strokeLinejoin: joins[props.strokeLinejoin] || 0,
        strokeDash: strokeDasharray || null,
        strokeWidth: +props.strokeWidth || 1
    };
}

export default function(props) {
    let strokeProps = strokeFilter(props);
    if (!strokeProps) {
        return {};
    }

    let {stroke} = strokeProps;
    return {
        ...strokeProps,
        stroke: stroke ? [stroke[0] / 255, stroke[1] / 255, stroke[2] / 255, stroke[3]] : null
    };

    // TODO: implement brush on stroke prop
    //return {
    //    ...strokeProps,
    //    stroke: extractBrush(strokeProps.stroke, props)
    //};
}

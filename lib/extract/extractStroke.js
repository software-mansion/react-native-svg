import extractBrush from './extractBrush';
import patterns from './patterns';

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

function strokeFilter(props, dimensions) {
    let strokeWidth = +props.strokeWidth;
    let {stroke} = props;
    if (!strokeWidth && !stroke) {
        return null;
    }

    let strokeDasharray = props.strokeDasharray;

    if (typeof strokeDasharray === 'string') {
        strokeDasharray = strokeDasharray.split(separator).map(dash => +dash);
    }

    // strokeDasharray length must be more than 1.
    if (strokeDasharray && strokeDasharray.length === 1) {
        strokeDasharray.push(strokeDasharray[0]);
    }

    if (!stroke) {
        stroke = '#000';
    }


    // TODO: dashoffset
    // TODO: propTypes check
    return {
        stroke: patterns(stroke, +props.strokeOpacity, dimensions, props.svgId),
        strokeLinecap: caps[props.strokeLinecap] || 0,
        strokeLinejoin: joins[props.strokeLinejoin] || 0,
        strokeDash: strokeDasharray || null,
        strokeWidth: strokeWidth || 1
    };
}

export default function(props, dimensions) {
    let strokeProps = strokeFilter(props, dimensions);
    return strokeProps ? {
        ...strokeProps,
        stroke: extractBrush(strokeProps.stroke, props)
    } : null;
}

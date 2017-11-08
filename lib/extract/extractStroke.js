import extractBrush from './extractBrush';
import extractOpacity from './extractOpacity';
import {strokeProps} from '../props';
import extractLengthList from "./extractLengthList";

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

const strokeKeys = Object.keys(strokeProps);

export default function(props, styleProperties) {
    strokeKeys.forEach((name) => {
        if (props.hasOwnProperty(name)) {
            styleProperties.push(name);
        }
    });

    const {stroke} = props;
    let {
        strokeWidth,
        strokeDasharray
    } = props;

    if (!strokeDasharray || strokeDasharray === 'none') {
        strokeDasharray = null;
    } else {
        // <dasharray> It's a list of comma and/or white space separated <length>s
        // and <percentage>s that specify the lengths of alternating dashes and gaps.
        // If an odd number of values is provided, then the list of values is repeated
        // to yield an even number of values. Thus, 5,3,2 is equivalent to 5,3,2,5,3,2.
        strokeDasharray = extractLengthList(strokeDasharray);
        if (strokeDasharray && (strokeDasharray.length % 2) === 1) {
            strokeDasharray = strokeDasharray.concat(strokeDasharray);
        }
    }

    if (!strokeWidth || typeof strokeWidth !== 'string') {
        strokeWidth = `${strokeWidth || 1}`;
    }

    return {
        stroke: extractBrush(stroke),
        strokeOpacity: extractOpacity(props.strokeOpacity),
        strokeLinecap: caps[props.strokeLinecap] || 0,
        strokeLinejoin: joins[props.strokeLinejoin] || 0,
        strokeDasharray: strokeDasharray,
        strokeWidth: strokeWidth,
        strokeDashoffset: strokeDasharray ? (+props.strokeDashoffset || 0) : null,
        strokeMiterlimit: props.strokeMiterlimit || 4,
    };

}

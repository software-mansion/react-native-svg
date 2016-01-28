import rgba from './rgba';

let separator = /\s*,\s*/;
export default function (props) {
    let strokeDasharray = props.strokeDash || props.strokeDasharray;

    if (typeof strokeDasharray === 'string') {
        strokeDasharray = strokeDasharray.split(separator).map(dash => +dash);
    }

    return {
        stroke: rgba(props.stroke, props.strokeOpacity),
        strokeCap:props.strokeLinecap || props.strokeCap || 'square',
        strokeJoin:props.strokeLinejoin || props.strokeJoin || 'miter',
        strokeDash:strokeDasharray
    };
}

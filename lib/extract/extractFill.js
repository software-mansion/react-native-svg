import rgba from '../rgba';
import extractBrush from './extractBrush';
import patterns from './patterns';

const fillRules = {
    evenodd: 0,
    nonzero: 1
};

function fillFilter(props) {
    let {fill} = props;
    let fillOpacity = +props.fillOpacity;

    if (fill === 'none') {
        return null;
    } else if (fill) {
        return patterns(fill, fillOpacity, props.svgId);
    } else if (props.fill === undefined) {
        return rgba('#000', isNaN(fillOpacity) ? 1 : fillOpacity).rgbaString();
    } else {
        return null;
    }
}

export default function(props) {
    let fill = extractBrush(fillFilter(props), props);
    let fillRule = fillRules[props.fillRule] === 0 ? 0 : 1;

    return {
        fill,
        fillRule
    };
}

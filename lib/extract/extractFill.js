import rgba from '../rgba';
import extractBrush from './extractBrush';
import patterns from './patterns';

const fillRules = {
    evenodd: 0,
    nonzero: 1
};

function fillFilter(props, dimensions) {
    let {fill} = props;

    if (fill === 'none') {
        return null;
    } else if (fill) {
        return patterns(fill, +props.fillOpacity, dimensions, props.svgId);
    } else if (props.fill === undefined) {
        let fillOpacity = +props.fillOpacity;
        if (isNaN(fillOpacity)) {
            fillOpacity = 1;
        }
        return rgba('#000', fillOpacity).rgbaString();
    } else {
        return null;
    }
}

export default function(props, dimensions) {
    let fill = extractBrush(fillFilter(props, dimensions), props);
    let fillRule = fillRules[props.fillRule] === 0 ? 0 : 1;

    return {
        fill,
        fillRule
    };
}

import rgba from '../rgba';
import {LinearGradientGenerator} from '../../elements/LinearGradient';
import {RadialGradientGenerator} from '../../elements/RadialGradient';
import extractBrush from './extractBrush';
import fillReg from './patternReg';

let fillPatterns = {};

function isGradient(obj) {
    return obj instanceof LinearGradientGenerator || obj instanceof RadialGradientGenerator;
}

function set(id, pattern) {
    fillPatterns[id] = pattern;
}

function remove(id) {
    delete fillPatterns[id];
}

const fillRules = {
    evenodd: 0,
    nonzero: 1
};

function fillFilter(props) {
    let {fill} = props;

    if (fill === 'none') {
        return null;
    } if (fill) {

        if (isGradient(fill)) {
            return fill;
        }

        let fillOpacity = +props.fillOpacity;
        if (isNaN(fillOpacity)) {
            fillOpacity = 1;
        }

        // 尝试匹配 fill="url(#pattern)"
        let matched = fill.match(fillReg);

        if (matched) {
            let patternName = `${matched[1]}:${props.svgId}`;
            let pattern = fillPatterns[patternName];

            if (pattern) {
                if (pattern.length === 2) {
                    let dimensions = this.getBoundingBox();
                    return pattern(dimensions, fillOpacity);
                } else {
                    return pattern(fillOpacity);
                }
            }
            return null;
        }

        return rgba(props.fill, fillOpacity).rgbaString();
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

export default function(props) {
    let fill = fillFilter.call(this, props);
    let fillRule = fillRules[props.fillRule] === 0 ? 0 : 1;

    return {
        fill: extractBrush(fill, props),
        fillRule
    };
}

export {
    set,
    remove
}

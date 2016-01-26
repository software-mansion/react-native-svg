import rgba from './rgba';
import {
    ART
} from 'react-native';

let {
    LinearGradient,
    RadialGradient
} = ART;

let fillPatterns = {};
let fillReg = /^url\(#(\w+?)\)$/;

function isGradient(obj) {
    return obj instanceof LinearGradient || obj instanceof RadialGradient;
}

export default function (props) {
    let {fill} = props;

    if (fill) {
        if (isGradient(fill)) {
            return fill;
        }

        // 尝试匹配 fill="url(#pattern)"
        let matched = fill.match(fillReg);
        if (matched) {
            let patternName = `${matched[1]}:${props.svgId}`;
            let pattern = fillPatterns[patternName];
            if (pattern) {
                if (typeof pattern === 'function') {
                    let dimensions = this.getBoundingBox();
                    return pattern(dimensions);
                } else {
                    return pattern;
                }
            }
            return null;
        }
    }

    return rgba(props.fill === undefined ? '#000' : props.fill, props.fillOpacity);
}

function set(id, pattern) {
    fillPatterns[id] = pattern;
}

function remove(id) {
    delete fillPatterns[id];
}

export {
    set,
    remove
}

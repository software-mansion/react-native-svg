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
export default function (props) {
    let {fill} = props;

    if (fill) {
        if (fill instanceof LinearGradient || fill instanceof RadialGradient) {
            return fill;
        }

        // 尝试匹配 fill="url(#pattern)"
        let matched = fill.match(fillReg);
        if (matched) {
            let patternName = `${matched[1]}:${props.svgId}`;
            if (fillPatterns[patternName]) {
                return fillPatterns[patternName];
            } else {
                return null;
            }
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

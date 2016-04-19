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

        return rgba(props.fill, fillOpacity);
    } else if (props.fill === undefined) {
        let fillOpacity = +props.fillOpacity;
        if (isNaN(fillOpacity)) {
            fillOpacity = 1;
        }
        return rgba('#000', fillOpacity);
    } else {
        return null;
    }

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

import rgba from '../rgba';
let patterns = {};
import patternReg from './patternReg';

import {LinearGradientGenerator} from '../../elements/LinearGradient';
import {RadialGradientGenerator} from '../../elements/RadialGradient';


function isGradient(obj) {
    return obj instanceof LinearGradientGenerator || obj instanceof RadialGradientGenerator;
}

function set(id, pattern) {
    patterns[id] = pattern;
}

function remove(id) {
    delete patterns[id];
}

export {
    set,
    remove
};

export default function(patternSting, opacity, svgId) {
    if (isGradient(patternSting)) {
        return patternSting;
    }

    // 尝试匹配 "url(#pattern)"
    let matched = patternSting.match(patternReg);

    if (matched) {
        let patternName = `${matched[1]}:${svgId}`;
        let pattern = patterns[patternName];

        if (pattern) {
            return pattern(opacity);
        }
        return null;
    }

    return rgba(patternSting, opacity).rgbaString();
}

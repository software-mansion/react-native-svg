import SerializablePath from 'react-native/Libraries/ART/ARTSerializablePath';
import clipReg from './patternReg';

let clipPatterns = {};
const clipRules = {
    evenodd: 0,
    nonzero: 1
};

function set(id, pattern) {
    clipPatterns[id] = pattern;
}

function remove(id) {
    delete clipPatterns[id];
}


export default function (props) {
    let {clipPath, clipRule} = props;
    let clippingProps = {};

    if (clipPath) {
        clippingProps.clipRule = clipRules[clipRule] === 0 ? 0 : 1;

        let matched = clipPath.match(clipReg);

        if (matched) {
            let patternName = `${matched[1]}:${props.svgId}`;
            let pattern = clipPatterns[patternName];
            if (pattern) {
                clippingProps.clipPathId = pattern;
            } else {
                clippingProps = null;
                // TODO: warn
            }
        } else {
            clippingProps.clipPath = new SerializablePath(clipPath).toJSON();
        }
    }
    return clippingProps;
}

export {
    set,
    remove
};

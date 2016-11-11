import SerializablePath from '../SerializablePath';
import clipReg from './patternReg';

const clipRules = {
    evenodd: 0,
    nonzero: 1
};

export default function (props) {
    let {clipPath, clipRule} = props;
    let clippingProps = {};

    if (clipPath) {
        clippingProps.clipRule = clipRules[clipRule] === 0 ? 0 : 1;

        let matched = clipPath.match(clipReg);

        if (matched) {
            clippingProps.clipPath = matched[1];
        }
    }

    return clippingProps;
}

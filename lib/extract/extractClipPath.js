import clipReg from './patternReg';

const clipRules = {
    evenodd: 0,
    nonzero: 1
};

export default function (props) {
    let {clipPath, clipRule} = props;
    let clipPathProps = {};

    if (clipPath) {
        clipPathProps.clipRule = clipRules[clipRule] === 0 ? 0 : 1;

        let matched = clipPath.match(clipReg);

        if (matched) {
            clipPathProps.clipPath = matched[1];
        } else {
            console.warn('Invalid `clipPath` prop, expected a clipPath like `"#id"`, but got: "' + clipPath + '"');
        }
    }

    return clipPathProps;
}

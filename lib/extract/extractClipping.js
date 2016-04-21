import SerializablePath from 'react-native/Libraries/ART/ARTSerializablePath';

const clipRules = {
    evenodd: 0,
    nonzero: 1
};

export default function (props) {
    let {clipPath, clipRule} = props;
    let clippingProps = {};

    if (clipPath) {
        clippingProps.clipPath = new SerializablePath(clipPath).toJSON();
        clippingProps.clipRule = clipRules[clipRule] === 0 ? 0 : 1;
    }

    return clippingProps;
}

import {PropTypes} from 'react';
import {PanResponder} from 'react-native';

const numberProp = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

const touchableProps = {
    disabled: PropTypes.bool,
    onPress: PropTypes.func,
    onPressIn: PropTypes.func,
    onPressOut: PropTypes.func,
    onLongPress: PropTypes.func,
    delayPressIn: PropTypes.number,
    delayPressOut: PropTypes.number,
    delayLongPress: PropTypes.number
};

const touchablePropsKeys = Object.keys(touchableProps);

const responderPropsKeys = [
    ...Object.keys(PanResponder.create({}).panHandlers),
    'pointerEvents'
];

const responderProps = responderPropsKeys.reduce((props, name) => {
    props[name] = PropTypes.func;
    return props;
}, {});

const fillProps = {
    fill: PropTypes.string,
    fillOpacity: numberProp,
    fillRule: PropTypes.oneOf(['evenodd', 'nonzero'])
};

const fillPropsKeys = Object.keys(fillProps);

const clipProps = {
    clipRule: PropTypes.oneOf(['evenodd', 'nonzero']),
    clipPath: PropTypes.string
};

const definationProps = {
    name: PropTypes.string
};

const strokeProps = {
    stroke: PropTypes.string,
    strokeWidth: numberProp,
    strokeOpacity: numberProp,
    strokeDasharray: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.number), PropTypes.string]),
    strokeDashoffset: numberProp,
    strokeLinecap: PropTypes.oneOf(['butt', 'square', 'round']),
    strokeLinejoin: PropTypes.oneOf(['miter', 'bevel', 'round']),
    strokeMiterlimit: numberProp
};

const strokePropsKeys = Object.keys(strokeProps);

const fillAndStrokePropsKeys = [...fillPropsKeys, ...strokePropsKeys];

const fontProps = {
    fontFamily: PropTypes.string,
    fontSize: numberProp,
    fontWeight: numberProp,
    fontStyle: PropTypes.string,
    font: PropTypes.object
};

const fontPropsKeys = Object.keys(fontProps);
const fontAndRenderPropsKeys = [...fillAndStrokePropsKeys, ...fontPropsKeys];

const transformProps = {
    scale: numberProp,
    scaleX: numberProp,
    scaleY: numberProp,
    rotate: numberProp,
    rotation: numberProp,
    translate: numberProp,
    translateX: numberProp,
    translateY: numberProp,
    x: numberProp,
    y: numberProp,
    origin: numberProp,
    originX: numberProp,
    originY: numberProp,
    skew: numberProp,
    skewX: numberProp,
    skewY: numberProp,
    transform: PropTypes.object
};

const pathProps = {
    ...fillProps,
    ...strokeProps,
    ...clipProps,
    ...transformProps,
    ...responderProps,
    ...touchableProps,
    ...definationProps
};

export {
    numberProp,
    fillProps,
    fillPropsKeys,
    strokeProps,
    strokePropsKeys,
    fillAndStrokePropsKeys,
    fontProps,
    fontPropsKeys,
    fontAndRenderPropsKeys,
    clipProps,
    transformProps,
    pathProps,
    responderProps,
    responderPropsKeys,
    touchableProps,
    touchablePropsKeys
};

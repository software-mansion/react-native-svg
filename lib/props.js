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

const textProps = {
    textAnchor: PropTypes.oneOf(['start', 'middle', 'end']),
    path: PropTypes.string,
    fontFamily: PropTypes.string,
    fontSize: numberProp,
    fontWeight: PropTypes.string,
    fontStyle: PropTypes.string,
    font: PropTypes.object,
    lines: numberProp
};

const transformProps = {
    scale: numberProp,
    scaleX: numberProp,
    scaleY: numberProp,
    rotate: numberProp,
    x: numberProp,
    y: numberProp,
    originX: numberProp,
    originY: numberProp,
    transform: PropTypes.string
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

const circleProps = {
    cx: numberProp.isRequired,
    cy: numberProp.isRequired,
    r: numberProp.isRequired
};

const ellipseProps = {
    cx: numberProp.isRequired,
    cy: numberProp.isRequired,
    rx: numberProp.isRequired,
    ry: numberProp.isRequired
};

const lineProps = {
    x1: numberProp.isRequired,
    x2: numberProp.isRequired,
    y1: numberProp.isRequired,
    y2: numberProp.isRequired
};

const rectProps = {
    x: numberProp.isRequired,
    y: numberProp.isRequired,
    width: numberProp.isRequired,
    height: numberProp.isRequired,
    rx: numberProp,
    ry: numberProp
};

export {
    numberProp,
    fillProps,
    clipProps,
    strokeProps,
    transformProps,
    textProps,
    circleProps,
    ellipseProps,
    lineProps,
    rectProps,
    pathProps,
    responderProps,
    responderPropsKeys,
    touchableProps,
    touchablePropsKeys
};

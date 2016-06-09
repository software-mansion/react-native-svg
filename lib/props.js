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
    ...touchableProps
};

const circleProps = {
    cx: numberProp,
    cy: numberProp,
    r: numberProp
};

const ellipseProps = {
    cx: numberProp,
    cy: numberProp,
    rx: numberProp,
    ry: numberProp
};

const lineProps = {
    x1: numberProp,
    x2: numberProp,
    y1: numberProp,
    y2: numberProp
};

const rectProps = {
    x: numberProp,
    y: numberProp,
    width: numberProp,
    height: numberProp,
    rx: numberProp,
    ry: numberProp
};

const contextProps = {
    ...circleProps,
    ...ellipseProps,
    ...lineProps,
    ...rectProps,
    ...fillProps,
    ...strokeProps,
    ...textProps
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
    contextProps,
    pathProps,
    responderProps,
    responderPropsKeys,
    touchableProps,
    touchablePropsKeys
};

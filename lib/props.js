import {
    PropTypes
} from 'react-native';

const numberProp = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

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
    strokeLinejoin: PropTypes.oneOf(['miter', 'bevel', 'round'])
};

const textProps = {
    textAnchor: PropTypes.oneOf(['right', 'center', 'left']),
    path: PropTypes.string
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
    ...transformProps
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

const shapeProps = {
    ...circleProps,
    ...ellipseProps,
    ...lineProps,
    ...rectProps,
    ...fillProps,
    ...strokeProps
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
    shapeProps,
    pathProps
}

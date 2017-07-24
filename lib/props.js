import PropTypes from 'prop-types';
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

const responderProps =  [
    ...Object.keys(PanResponder.create({}).panHandlers),
    'pointerEvents'
].reduce((props, name) => {
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
    strokeWidth: PropTypes.string,
    strokeOpacity: numberProp,
    strokeDasharray: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.number), PropTypes.string]),
    strokeDashoffset: numberProp,
    strokeLinecap: PropTypes.oneOf(['butt', 'square', 'round']),
    strokeLinejoin: PropTypes.oneOf(['miter', 'bevel', 'round']),
    strokeMiterlimit: numberProp
};

// normal | italic | oblique | inherit
// https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/font-style
const fontStyle = PropTypes.oneOf(['normal', 'italic', 'oblique']);

// normal | small-caps | inherit
// https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/font-variant
const fontVariant = PropTypes.oneOf(['normal', 'small-caps']);

// normal | bold | bolder | lighter | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
// https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/font-weight
const fontWeight = PropTypes.oneOf(['normal', 'bold', 'bolder', 'lighter', '100', '200', '300', '400', '500', '600', '700', '800', '900']);

// normal | wider | narrower | ultra-condensed | extra-condensed | condensed | semi-condensed | semi-expanded | expanded | extra-expanded | ultra-expanded | inherit
// https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/font-stretch
const fontStretch = PropTypes.oneOf(['normal', 'wider', 'narrower', 'ultra-condensed', 'extra-condensed', 'condensed', 'semi-condensed', 'semi-expanded', 'expanded', 'extra-expanded', 'ultra-expanded']);

// <absolute-size> | <relative-size> | <length> | <percentage> | inherit
// https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/font-size
const fontSize = PropTypes.string;

// [[<family-name> | <generic-family>],]* [<family-name> | <generic-family>] | inherit
// https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/font-family
const fontFamily = PropTypes.string;

/*
    font syntax [ [ <'font-style'> || <font-variant-css21> || <'font-weight'> || <'font-stretch'> ]? <'font-size'> [ / <'line-height'> ]? <'font-family'> ] | caption | icon | menu | message-box | small-caption | status-bar
    where <font-variant-css21> = [ normal | small-caps ]

    Shorthand property for setting ‘font-style’, ‘font-variant’,
    ‘font-weight’, ‘font-size’, ‘line-height’ and ‘font-family’.

    The ‘line-height’ property has no effect on text layout in SVG.

    Note: for the purposes of processing the ‘font’ property in SVG,
    'line-height' is assumed to be equal the value for property ‘font-size’

    https://www.w3.org/TR/SVG11/text.html#FontProperty
    https://developer.mozilla.org/en-US/docs/Web/CSS/font
    https://drafts.csswg.org/css-fonts-3/#font-prop
    https://www.w3.org/TR/CSS2/fonts.html#font-shorthand
    https://www.w3.org/TR/CSS1/#font
*/
const font = PropTypes.object;

// start | middle | end | inherit
// https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/text-anchor
const textAnchor = PropTypes.oneOf(['start', 'middle', 'end']);

// none | underline | overline | line-through | blink | inherit
// https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/text-decoration
const textDecoration = PropTypes.oneOf(['none', 'underline', 'overline', 'line-through', 'blink']);

// normal | <length> | inherit
// https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/letter-spacing
const letterSpacing = PropTypes.string;

// normal | <length> | inherit
// https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/word-spacing
const wordSpacing = PropTypes.string;

// auto | <length> | inherit
// https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/kerning
const kerning = PropTypes.string;

const fontProps = {
    fontStyle,
    fontVariant,
    fontWeight,
    fontStretch,
    fontSize,
    fontFamily,
    textAnchor,
    textDecoration,
    letterSpacing,
    wordSpacing,
    kerning,
    font
};

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
    transform: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
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
    strokeProps,
    fontProps,
    clipProps,
    pathProps,
    responderProps,
    touchableProps
};

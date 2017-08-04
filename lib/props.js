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
    strokeWidth: numberProp,
    strokeOpacity: numberProp,
    strokeDasharray: PropTypes.oneOfType([PropTypes.arrayOf(numberProp), PropTypes.string]),
    strokeDashoffset: numberProp,
    strokeLinecap: PropTypes.oneOf(['butt', 'square', 'round']),
    strokeLinejoin: PropTypes.oneOf(['miter', 'bevel', 'round']),
    strokeMiterlimit: numberProp
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

/*
Name:	font-variant-ligatures
Value:	normal | none | [ <common-lig-values> || <discretionary-lig-values> || <historical-lig-values> || <contextual-alt-values> ]
    Initial:	normal
    Applies to:	all elements
    Inherited:	yes
    Percentages:	N/A
    Media:	visual
    Computed value:	as specified
    Animatable:	no

 Ligatures and contextual forms are ways of combining glyphs to produce more harmonized forms.

 <common-lig-values>        = [ common-ligatures | no-common-ligatures ]
 <discretionary-lig-values> = [ discretionary-ligatures | no-discretionary-ligatures ]
 <historical-lig-values>    = [ historical-ligatures | no-historical-ligatures ]
 <contextual-alt-values>    = [ contextual | no-contextual ]

 https://developer.mozilla.org/en/docs/Web/CSS/font-variant-ligatures
 https://www.w3.org/TR/css-fonts-3/#font-variant-ligatures-prop
*/
const fontVariantLigatures = PropTypes.oneOf(['normal', 'none']);

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
    fontVariantLigatures,
    font
};

/*
 Name	Value	Initial value	Animatable
 lengthAdjust	spacing | spacingAndGlyphs	spacing	yes
 https://svgwg.org/svg2-draft/text.html#TextElementLengthAdjustAttribute
 https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/lengthAdjust
 */
const lengthAdjust = PropTypes.oneOf(['spacing', 'spacingAndGlyphs']);

/*
 Name	Value	Initial value	Animatable
 textLength	<length> | <percentage> | <number>	See below	yes
 https://svgwg.org/svg2-draft/text.html#TextElementTextLengthAttribute
 https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/textLength
*/
const textLength = PropTypes.string;

/*
 2.2. Transverse Box Alignment: the vertical-align property

 Name:	vertical-align
 Value:	<‘baseline-shift’> || <‘alignment-baseline’>
 Initial:	baseline
 Applies to:	inline-level boxes
 Inherited:	no
 Percentages:	N/A
 Media:	visual
 Computed value:	as specified
 Canonical order:	per grammar
 Animation type:	discrete
 This shorthand property specifies how an inline-level box is aligned within the line.
 Values are the same as for its longhand properties, see below.

 Authors should use this property (vertical-align) instead of its longhands.

 https://www.w3.org/TR/css-inline-3/#transverse-alignment
 https://drafts.csswg.org/css-inline/#propdef-vertical-align
 */
const verticalAlign = PropTypes.string;

/*
 Name:	alignment-baseline

 1.1 Value:  	auto | baseline | before-edge | text-before-edge | middle | central | after-edge | text-after-edge | ideographic | alphabetic | hanging | mathematical | inherit
 2.0 Value:	baseline | text-bottom | alphabetic | ideographic | middle | central | mathematical | text-top | bottom | center | top
 Initial:	baseline
 Applies to:	inline-level boxes, flex items, grid items, table cells
 Inherited:	no
 Percentages:	N/A
 Media:	visual
 Computed value:	as specified
 Canonical order:	per grammar
 Animation type:	discrete
 https://drafts.csswg.org/css-inline/#propdef-alignment-baseline
 https://www.w3.org/TR/SVG11/text.html#AlignmentBaselineProperty
 https://svgwg.org/svg2-draft/text.html#AlignmentBaselineProperty
 https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/alignment-baseline
*/
const alignmentBaseline = PropTypes.oneOf(['baseline', 'text-bottom', 'alphabetic', 'ideographic', 'middle', 'central', 'mathematical', 'text-top', 'bottom', 'center', 'top', 'text-before-edge', 'text-after-edge', 'before-edge', 'after-edge', 'hanging']);

/*
 2.2.2. Alignment Shift: baseline-shift longhand

 Name:	baseline-shift
 Value:	<length> | <percentage> | sub | super
 Initial:	0
 Applies to:	inline-level boxes
 Inherited:	no
 Percentages:	refer to the used value of line-height
 Media:	visual
 Computed value:	absolute length, percentage, or keyword specified
 Animation type:	discrete

 This property specifies by how much the box is shifted up from its alignment point.
 It does not apply when alignment-baseline is top or bottom.

 https://www.w3.org/TR/css-inline-3/#propdef-baseline-shift
*/
const baselineShift = PropTypes.oneOfType([PropTypes.oneOf(['sub', 'super', 'baseline']), PropTypes.arrayOf(numberProp), PropTypes.string]);

const textSpecificProps = {
    ...pathProps,
    ...fontProps,
    alignmentBaseline,
    baselineShift,
    verticalAlign,
    lengthAdjust,
    textLength,
};

// https://svgwg.org/svg2-draft/text.html#TSpanAttributes
const textProps = {
    ...textSpecificProps,
    dx: PropTypes.string,
    dy: PropTypes.string,
};

/*
 Name
 side
 Value
 left | right
 initial value
 left
 Animatable
 yes
 https://svgwg.org/svg2-draft/text.html#TextPathElementSideAttribute
*/
const side = PropTypes.oneOf(['left', 'right']);

/*
 Name
 startOffset
 Value
 <length> | <percentage> | <number>
 initial value
 0
 Animatable
 yes
 https://svgwg.org/svg2-draft/text.html#TextPathElementStartOffsetAttribute
 https://developer.mozilla.org/en/docs/Web/SVG/Element/textPath
 */
const startOffset = PropTypes.string;

/*
 Name
 method
 Value
 align | stretch
 initial value
 align
 Animatable
 yes
 https://svgwg.org/svg2-draft/text.html#TextPathElementMethodAttribute
 https://developer.mozilla.org/en/docs/Web/SVG/Element/textPath
 */
const method = PropTypes.oneOf(['align', 'stretch']);

/*
 Name
 spacing
 Value
 auto | exact
 initial value
 exact
 Animatable
 yes
 https://svgwg.org/svg2-draft/text.html#TextPathElementSpacingAttribute
 https://developer.mozilla.org/en/docs/Web/SVG/Element/textPath
 */
const spacing = PropTypes.oneOf(['auto', 'exact']);

/*
 Name
 mid-line
 Value
 sharp | smooth
 initial value
 smooth
 Animatable
 yes
 */
const midLine = PropTypes.oneOf(['sharp', 'smooth']);

// https://svgwg.org/svg2-draft/text.html#TextPathAttributes
// https://developer.mozilla.org/en/docs/Web/SVG/Element/textPath
const textPathProps = {
    ...textSpecificProps,
    href: PropTypes.string.isRequired,
    startOffset,
    method,
    spacing,
    side,
    midLine,
};

export {
    numberProp,
    fillProps,
    strokeProps,
    fontProps,
    textProps,
    textPathProps,
    clipProps,
    pathProps,
    responderProps,
    touchableProps
};

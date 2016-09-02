import SerializablePath from '../SerializablePath';
import _ from 'lodash';
const fontRegExp = /^\s*((?:(?:normal|bold|italic)\s+)*)(?:(\d+(?:\.\d+)?)[ptexm%]*(?:\s*\/.*?)?\s+)?\s*"?([^"]*)/i;
const fontFamilyPrefix = /^[\s"']*/;
const fontFamilySuffix = /[\s"']*$/;
const spaceReg = /\s+/;
const commaReg = /,/;

const anchors = {
    end: 1,
    middle: 2,
    start: 0
};

let cachedFontObjectsFromString = {};

function extractSingleFontFamily(fontFamilyString) {
    // SVG on the web allows for multiple font-families to be specified.
    // For compatibility, we extract the first font-family, hoping
    // we'll get a match.
    return fontFamilyString ? fontFamilyString.split(commaReg)[0]
        .replace(fontFamilyPrefix, '')
        .replace(fontFamilySuffix, '') : null;
}

function parseFontString(font) {
    if (cachedFontObjectsFromString.hasOwnProperty(font)) {
        return cachedFontObjectsFromString[font];
    }
    let match = fontRegExp.exec(font);
    if (!match) {
        return null;
    }
    let fontFamily = extractSingleFontFamily(match[3]);
    let fontSize = +match[2] || 12;
    let isBold = /bold/.exec(match[1]);
    let isItalic = /italic/.exec(match[1]);
    cachedFontObjectsFromString[font] = {
        fontFamily: fontFamily,
        fontSize: fontSize,
        fontWeight: isBold ? 'bold' : 'normal',
        fontStyle: isItalic ? 'italic' : 'normal'
    };
    return cachedFontObjectsFromString[font];
}

function extractFont(props) {
    let font = props.font;
    let fontSize = +props.fontSize;

    let ownedFont = {
        fontFamily: extractSingleFontFamily(props.fontFamily),
        fontSize: isNaN(fontSize) ? null : fontSize,
        fontWeight: props.fontWeight,
        fontStyle: props.fontStyle
    };

    if (typeof props.font === 'string') {
        font = parseFontString(props.font);
    }
    ownedFont = _.pickBy(ownedFont, prop => !_.isNil(prop));

    return _.defaults(ownedFont, font);
}

function parseText(props, inheritedProps) {
    let {
        children,
        dx = '',
        dy = ''
    } = props;

    if (typeof children === 'string') {

    } else {

    }

    console.log(dx, dy, children);
}

function parseDelta(delta) {
    return delta.toString().trim().split(spaceReg);
}

export default function(props) {
    parseText(props, null);

    let alignment;
    //if (firstSpan && firstSpan.props.hasOwnProperty('textAnchor')) {
    //    alignment = anchors[firstSpan.props.textAnchor];
    //} else if (anchors[props.textAnchor]) {
    //    alignment = anchors[props.textAnchor];
    //}
    //
    //if (!alignment) {
    //    alignment = 0;
    //}

    return {
        //alignment,
        //children,
        fontFamily: 'Helvetica Neue',
        fontSize: 12,
        fontStyle: 'normal',
        fontWeight: 'normal',
        ...extractFont(props)
    }
}

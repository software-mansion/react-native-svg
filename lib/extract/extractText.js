import SerializablePath from '../SerializablePath';
import _ from 'lodash';
const newLine = /\n/g;
const defaultFontFamily = '"Helvetica Neue", "Helvetica", Arial';
const fontRegExp = /^\s*((?:(?:normal|bold|italic)\s+)*)(?:(\d+(?:\.\d+)?)[ptexm%]*(?:\s*\/.*?)?\s+)?\s*"?([^"]*)/i;
const fontFamilyPrefix = /^[\s"']*/;
const fontFamilySuffix = /[\s"']*$/;
let cachedFontObjectsFromString = {};

function childrenAsString(children) {
    if (typeof children === 'undefined') {
        return '';
    }
    if (typeof children === 'number') {
        return children.toString();
    }
    if (typeof children === 'string') {
        return children;
    }
    if (children.length) {
        return children.join('\n');
    }
    return '';
}

function extractFontAndLines(font, text) {
    return {
        font: extractFont(font),
        lines: text.split(newLine)
    };
}

function extractSingleFontFamily(fontFamilyString = defaultFontFamily) {
    // SVG on the web allows for multiple font-families to be specified.
    // For compatibility, we extract the first font-family, hoping
    // we'll get a match.
    return fontFamilyString.split(',')[0]
        .replace(fontFamilyPrefix, '')
        .replace(fontFamilySuffix, '');
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

function extractFont(font) {
    if (_.isNil(font)) {
        return null;
    }
    if (typeof font === 'string') {
        return parseFontString(font);
    }
    let fontFamily = extractSingleFontFamily(font.fontFamily);
    let fontSize = +font.fontSize || 12;

    return {
        fontFamily: fontFamily,
        fontSize: fontSize,
        fontWeight: font.fontWeight,
        fontStyle: font.fontStyle
    };
}

const anchord = {
    end: 1,
    middle: 2,
    start: 0
};

export default function(props) {
    return {
        alignment: anchord[props.textAnchor] || 0,
        frame: extractFontAndLines(
            props,
            childrenAsString(props.children)
        ),
        path: props.path ? new SerializablePath(props.path).toJSON() : undefined
    };
}

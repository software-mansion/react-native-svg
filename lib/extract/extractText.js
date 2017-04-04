import _ from 'lodash';
import React, {Children} from 'react';
import TSpan from '../../elements/TSpan';

const fontRegExp = /^\s*((?:(?:normal|bold|italic)\s+)*)(?:(\d+(?:\.\d+)?)[ptexm%]*(?:\s*\/.*?)?\s+)?\s*"?([^"]*)/i;
const fontFamilyPrefix = /^[\s"']*/;
const fontFamilySuffix = /[\s"']*$/;
const spaceReg = /\s+/;
const commaReg = /,/g;

const anchors = {
    auto: 0,
    start: 1,
    middle: 2,
    end: 3
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

function parseDelta(delta) {
    if (typeof delta === 'string') {
        if (isNaN(+delta)) {
            return delta.trim().replace(commaReg, ' ').split(spaceReg).map(d => +d || 0);
        } else {
            return [+delta];
        }
    } else if (typeof delta === 'number') {
        return [delta];
    } else {
        return [];
    }
}

export default function(props, container) {
    const {
        x,
        y,
        dx,
        dy,
        textAnchor,
        startOffset
    } = props;


    const deltaX = parseDelta(dx);
    const deltaY = parseDelta(dy);
    let { children } = props;
    let content = null;


    if (typeof children === 'string' || typeof children === 'number') {
        const childrenString = children.toString();
        if (container) {
            children = <TSpan>{childrenString}</TSpan>;
        } else {
            content = childrenString;
            children = null;
        }
    } else if (Children.count(children) > 1 || Array.isArray(children)) {
        children = Children.map(children, child => {
            if (typeof child === 'string' || typeof child === 'number') {
                return <TSpan>{child.toString()}</TSpan>;
            } else {
                return child;
            }
        });
    }

    return {
        textAnchor: anchors[textAnchor] || 0,
        font: extractFont(props),
        children,
        content,
        deltaX,
        deltaY,
        startOffset: (startOffset || 0).toString(),
        positionX: _.isNil(x) ? null : x.toString(),
        positionY: _.isNil(y) ? null : y.toString()
    };
}

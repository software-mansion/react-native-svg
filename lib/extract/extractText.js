import _ from 'lodash';
//noinspection JSUnresolvedVariable
import React, {Children} from 'react';
import TSpan from '../../elements/TSpan';

const fontRegExp = /^\s*((?:(?:normal|bold|italic)\s+)*)(?:(\d+(?:\.\d+)?[ptexm%])*(?:\s*\/.*?)?\s+)?\s*"?([^"]*)/i;
const fontFamilyPrefix = /^[\s"']*/;
const fontFamilySuffix = /[\s"']*$/;
const spaceReg = /\s+/;
const commaReg = /,/g;

const cachedFontObjectsFromString = {};

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
    const match = fontRegExp.exec(font);
    if (!match) {
        return null;
    }
    const fontFamily = extractSingleFontFamily(match[3]);
    const fontSize = match[2] || '12';
    const isBold = /bold/.exec(match[1]);
    const isItalic = /italic/.exec(match[1]);
    const fontWeight = isBold ? 'bold' : 'normal';
    const fontStyle = isItalic ? 'italic' : 'normal';
    cachedFontObjectsFromString[font] = {
        fontSize,
        fontFamily,
        fontWeight,
        fontStyle,
    };
    return cachedFontObjectsFromString[font];
}

export function extractFont(props) {
    const {
        fontStyle,
        fontVariant,
        fontWeight,
        fontStretch,
        textAnchor,
        textDecoration,
        letterSpacing,
        wordSpacing,
        kerning,
    } = props;
    let {
        fontSize,
        fontFamily,
        font,
    } = props;

    fontFamily = extractSingleFontFamily(fontFamily);
    fontSize = fontSize ?  '' + fontSize : null;

    const ownedFont = _.pickBy({
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
    }, prop => !_.isNil(prop));

    if (typeof font === 'string') {
        font = parseFontString(font);
    }

    return _.defaults(ownedFont, font);
}

function parseSVGLengthList(delta) {
    if (typeof delta === 'string') {
        return delta.trim().replace(commaReg, ' ').split(spaceReg);
    } else if (typeof delta === 'number') {
        return [delta.toString()];
    } else if (delta && typeof delta.map === 'function') {
        return delta.map(d => `${d}`);
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
        alignmentBaseline,
    } = props;
    let {
        rotate,
        children
    } = props;

    const positionX = parseSVGLengthList(x);
    const positionY = parseSVGLengthList(y);
    const deltaX = parseSVGLengthList(dx);
    const deltaY = parseSVGLengthList(dy);
    rotate = parseSVGLengthList(rotate);

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

    const font = extractFont(props);

    return {
        font,
        children,
        content,
        positionX,
        positionY,
        rotate,
        deltaX,
        deltaY,
        alignmentBaseline,
    };
}

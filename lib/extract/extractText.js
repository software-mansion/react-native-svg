import SerializablePath from '../SerializablePath';
import _ from 'lodash';
import React, {Children} from 'react';
import {fontAndRenderPropsKeys} from '../props';
import Span from '../../elements/Span';

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

function parseText(props, inheritedProps = {}, deltas = []) {
    let {
        children,
        dx = '',
        dy = '',
        x,
        y
    } = props;

    const spanArray = [];
    const deltaXArray = parseDelta(dx);
    const deltaYArray = parseDelta(dy);
    const maxDeltaLength = Math.max(deltaXArray.length, deltaYArray.length);

    for (let i = 0; i < maxDeltaLength; i++) {
        let result = {};

        if (deltaXArray.length > i && deltaXArray[i]) {
            result.x = deltaXArray[i];
        } else {
            let inheritedDeltaX = _.get(deltas, `${i}.x`);
            if (inheritedDeltaX) {
                result.x = inheritedDeltaX;
            }
        }

        if (deltaYArray.length > i && deltaYArray[i]) {
            result.y = deltaYArray[i];
        } else {
            let inheritedDeltaY = _.get(deltas, `${i}.y`);
            if (inheritedDeltaY) {
                result.y = inheritedDeltaY;
            }
        }

        deltas[i] = result;
    }


    if (typeof children === 'string') {
        let computedProps = _.reduce(inheritedProps, (prev, value, name) => {
            if (!prev.hasOwnProperty(name)) {
                prev[name] = value;
            }

            return prev;
        }, _.omit(props, ['children', 'x', 'y']));

        let delta = deltas.shift();

        while (delta) {
            let text;
            if (deltas.length) {
                text = children.slice(0, 1);
                children = children.slice(1);
            } else {
                text = children;
            }

            spanArray.push({
                content: text,
                props: computedProps,
                deltaX: +delta.x || 0,
                deltaY: +delta.y || 0,
                positionX: x || null,
                positionY: y || null
            });

            if (!text) {
                return spanArray;
            } else {
                delta = deltas.shift();
            }
        };

    } else {
        fontAndRenderPropsKeys.forEach(inheritablePropName => {
            if (props.hasOwnProperty(inheritablePropName)) {
                inheritedProps[inheritablePropName] = props[inheritablePropName];
            }
        });

        Children.forEach(children, child => {
            spanArray.push(...parseText(child.props, inheritedProps, deltas));
        })
    }


    return spanArray;
}

function parseDelta(delta) {
    return delta.toString().trim().split(spaceReg);
}

export default function(props) {
    let frames = parseText(props);
    let alignment;

    if (frames[0]) {
        let firstSpan = frames[0];

        if (firstSpan.positionX === null && props.hasOwnProperty('x')) {
            firstSpan.positionX = props.x;
        }

        if (firstSpan.positionY === null && props.hasOwnProperty('y')) {
            firstSpan.positionY = props.y;
        }

        if (firstSpan.props.hasOwnProperty('textAnchor')) {
            alignment = anchors[firstSpan.props.textAnchor];
        } else if (anchors[props.textAnchor]) {
            alignment = anchors[props.textAnchor];
        }

        if (!alignment) {
            alignment = 0;
        }
    }

    let font = {
        fontFamily: 'Helvetica Neue',
        fontSize: 12,
        fontStyle: 'normal',
        fontWeight: 'normal',
        ...extractFont(props)
    }


    let children = frames.map(frame => {
        let spanProps = {
            content: frame.content,
            dx: frame.deltaX,
            dy: frame.deltaY,
            px: frame.positionX,
            py: frame.positionY,
            font: {
                ...font,
                ...extractFont(frame.props)
            }
        };
        return <Span {...spanProps} />
    })
    // TODO: format children
    return {
        alignment,
        children
    }
}

//noinspection JSUnresolvedVariable
import React, { Children } from "react";
import extractLengthList from "./extractLengthList";
import { notNil, pickBy } from "../util";

const fontRegExp = /^\s*((?:(?:normal|bold|italic)\s+)*)(?:(\d+(?:\.\d+)?[ptexm%])*(?:\s*\/.*?)?\s+)?\s*"?([^"]*)/i;
const fontFamilyPrefix = /^[\s"']*/;
const fontFamilySuffix = /[\s"']*$/;
const commaReg = /\s*,\s*/g;

const cachedFontObjectsFromString = {};

function extractSingleFontFamily(fontFamilyString) {
    // SVG on the web allows for multiple font-families to be specified.
    // For compatibility, we extract the first font-family, hoping
    // we'll get a match.
    return fontFamilyString
        ? fontFamilyString
              .split(commaReg)[0]
              .replace(fontFamilyPrefix, "")
              .replace(fontFamilySuffix, "")
        : null;
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
    const fontSize = match[2] || "12";
    const isBold = /bold/.exec(match[1]);
    const isItalic = /italic/.exec(match[1]);
    const fontWeight = isBold ? "bold" : "normal";
    const fontStyle = isItalic ? "italic" : "normal";
    cachedFontObjectsFromString[font] = {
        fontSize,
        fontFamily,
        fontWeight,
        fontStyle,
    };
    return cachedFontObjectsFromString[font];
}

export function extractFont(prop) {
    const props = { ...prop.style, ...prop };
    const {
        fontData,
        fontStyle,
        fontVariant,
        fontWeight,
        fontStretch,
        textAnchor,
        textDecoration,
        letterSpacing,
        wordSpacing,
        kerning,
        fontVariantLigatures,
        fontFeatureSettings,
    } = props;
    let { fontSize, fontFamily, font } = props;

    fontFamily = extractSingleFontFamily(fontFamily);
    fontSize = fontSize ? "" + fontSize : null;

    const ownedFont = pickBy(
        {
            fontData,
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
            fontFeatureSettings,
        },
        notNil,
    );

    if (typeof font === "string") {
        font = parseFontString(font);
    }

    return { ...font, ...ownedFont };
}

function getChildren(children, TSpan) {
    const reactChildren = Children.toArray(children);
    const result = [];
    for (let child of reactChildren) {
        if (typeof child === "string" || typeof child === "number") {
            result.push(<TSpan>{child.toString()}</TSpan>);
        } else {
            result.push(child);
        }
    }
    return result;
}

export default function(props, container = false, TSpan) {
    const {
        x,
        y,
        dx,
        dy,
        rotate,
        baselineShift,
        verticalAlign,
        alignmentBaseline,
    } = props;
    let { children } = props;

    let content = null;
    if (typeof children === "string" || typeof children === "number") {
        const childrenString = children.toString();
        if (container) {
            children = <TSpan>{childrenString}</TSpan>;
        } else {
            content = childrenString;
            children = null;
        }
    } else if (Children.count(children) > 1 || Array.isArray(children)) {
        children = getChildren(children, TSpan);
    }

    return {
        content,
        children,
        baselineShift,
        verticalAlign,
        alignmentBaseline,
        font: extractFont(props),
        x: extractLengthList(x),
        y: extractLengthList(y),
        dx: extractLengthList(dx),
        dy: extractLengthList(dy),
        rotate: extractLengthList(rotate),
    };
}


function arrayDiffer(a, b) {
    if (a == null) {
        return true;
    }
    if (a.length !== b.length) {
        return true;
    }
    for (var i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return true;
        }
    }
    return false;
}

function fontAndLinesDiffer(a, b) {
    if (a === b) {
        return false;
    }
    if (a.font !== b.font) {
        if (a.font === null) {
            return true;
        }
        if (b.font === null) {
            return true;
        }

        if (
            a.font.fontFamily !== b.font.fontFamily ||
            a.font.fontSize !== b.font.fontSize ||
            a.font.fontWeight !== b.font.fontWeight ||
            a.font.fontStyle !== b.font.fontStyle
        ) {
            return true;
        }
    }
    return arrayDiffer(a.lines, b.lines);
}

var NodeAttributes = {
    transform: {
        diff: arrayDiffer
    },
    opacity: true,
    clipPath: {
        diff: arrayDiffer
    },
    clipRule: true
};

var GroupAttributes = Object.assign({
}, NodeAttributes);

var RenderableAttributes = Object.assign({
    fill: {
        diff: arrayDiffer
    },
    stroke: {
        diff: arrayDiffer
    },
    strokeWidth: true,
    strokeLinecap: true,
    strokeLinejoin: true,
    fillRule: true,
    strokeDash: {
        diff: arrayDiffer
    },
    strokeDashoffset: true
}, NodeAttributes);

var PathAttributes = Object.assign({
    d: {
        diff: arrayDiffer
    }
}, RenderableAttributes);

var TextAttributes = Object.assign({
    alignment: true,
    frame: {
        diff: fontAndLinesDiffer
    },
    path: {
        diff: arrayDiffer
    }
}, RenderableAttributes);

export {
    GroupAttributes,
    PathAttributes,
    TextAttributes
}


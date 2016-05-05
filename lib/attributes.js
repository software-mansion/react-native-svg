import _ from 'lodash';

function arrayDiffer(a, b) {
    if (_.isNil(a)) {
        return true;
    }
    if (a.length !== b.length) {
        return true;
    }
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return true;
        }
    }
    return false;
}

function percentageDiffer(a, b) {
    if (a === b) {
        return false;
    }
    for (let key in a) {
        if (a.hasOwnProperty(key)) {
            if (key === 'type' && a.type !== b.type) {
                return true;
            } else if (a[key].percentage !== b[key].percentage || a[key].value !== b[key].value) {
                return true;
            }
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

const NodeAttributes = {
    transform: {
        diff: arrayDiffer
    },
    opacity: true,
    clipPath: {
        diff: arrayDiffer
    },
    clipPathId: true,
    clipRule: true
};

const GroupAttributes = {
    asClipPath: true,
    ...NodeAttributes
};

const RenderableAttributes = {
    fill: {
        diff: arrayDiffer
    },
    fillRule: true,
    stroke: {
        diff: arrayDiffer
    },
    strokeWidth: true,
    strokeLinecap: true,
    strokeLinejoin: true,
    strokeDasharray: {
        diff: arrayDiffer
    },
    strokeDashoffset: true,
    ...NodeAttributes
};

const PathAttributes = {
    d: {
        diff: arrayDiffer
    },
    ...RenderableAttributes
};

const TextAttributes = {
    alignment: true,
    frame: {
        diff: fontAndLinesDiffer
    },
    path: {
        diff: arrayDiffer
    },
    ...RenderableAttributes
};

const ShapeAttributes = {
    shape: {
        diff: percentageDiffer
    },
    ...RenderableAttributes
};

const ImageAttributes = {
    ...NodeAttributes,
    layout: {
        diff: percentageDiffer
    },
    src: true
};

export {
    GroupAttributes,
    PathAttributes,
    TextAttributes,
    ShapeAttributes,
    ImageAttributes
};


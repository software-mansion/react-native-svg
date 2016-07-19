import _ from 'lodash';

const merge = _.assign;

function arrayDiffer(a, b) {
    if (a == null || b == null) {
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

const NodeAttributes = {
    transform: {
        diff: arrayDiffer
    },
    opacity: true,
    clipPathRef: true,
    responsible: true
};

const RenderableAttributes = merge(NodeAttributes, {
    fill: {
        diff: arrayDiffer
    },
    stroke: {
        diff: arrayDiffer
    },
    fillRule: true,
    strokeWidth: true,
    strokeLinecap: true,
    strokeLinejoin: true,
    clipPath: {
        diff: arrayDiffer
    },
    clipRule: true,
    strokeDasharray: {
        diff: arrayDiffer
    },
    strokeDashoffset: true,
    strokeMiterlimit: true
});

const GroupAttributes = merge(NodeAttributes, {
    clipPath: {
        diff: arrayDiffer
    },
    clipRule: true
});

const PathAttributes = merge(RenderableAttributes, {
    d: {
        diff: arrayDiffer
    }
});

const TextAttributes = merge(RenderableAttributes, {
    alignment: true,
    frame: {
        diff: fontAndLinesDiffer
    },
    path: {
        diff: arrayDiffer
    }
});

const ClipPathAttributes = merge(RenderableAttributes, {
    name: true
});

const CircleAttributes = merge(RenderableAttributes, {
    cx: true,
    cy: true,
    r: true
});

const EllipseAttributes = merge(RenderableAttributes, {
    cx: true,
    cy: true,
    rx: true,
    ry: true
});

const ImageAttributes = merge(RenderableAttributes, {
    x: true,
    y: true,
    width: true,
    height: true,
    src: true
});

const LineAttributes = merge(RenderableAttributes, {
    x1: true,
    y1: true,
    x2: true,
    y2: true
});

const RectAttributes = merge(RenderableAttributes, {
    x: true,
    y: true,
    width: true,
    height: true,
    rx: true,
    ry: true
});


export {
    PathAttributes,
    TextAttributes,
    GroupAttributes,
    ClipPathAttributes,
    CircleAttributes,
    EllipseAttributes,
    ImageAttributes,
    LineAttributes,
    RectAttributes
};

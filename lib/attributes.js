
function arrayDiffer(a, b) {
    /*eslint eqeqeq:0*/
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

function fontDiffer(a, b) {
    if (a === b) {
        return false;
    }

    return a.fontSize !== b.fontSize ||
        a.fontFamily !== b.fontFamily ||
        a.fontStyle !== b.fontStyle ||
        a.fontWeight !== b.fontWeight;
}

const ViewBoxAttributes = {
    minX: true,
    minY: true,
    vbWidth: true,
    vbHeight: true,
    align: true,
    meetOrSlice: true
};

const NodeAttributes = {
    name: true,
    matrix: {
        diff: arrayDiffer
    },
    opacity: true,
    clipRule: true,
    clipPath: true,
    propList: {
        diff: arrayDiffer
    },
    responsible: true
};

const FillAndStrokeAttributes = {
    fill: {
        diff: arrayDiffer
    },
    fillOpacity: true,
    fillRule: true,
    stroke: {
        diff: arrayDiffer
    },
    strokeOpacity: true,
    strokeWidth: true,
    strokeLinecap: true,
    strokeLinejoin: true,
    strokeDasharray: {
        diff: arrayDiffer
    },
    strokeDashoffset: true,
    strokeMiterlimit: true
};

const RenderableAttributes = {
    ...NodeAttributes,
    ...FillAndStrokeAttributes
};

const GroupAttributes = RenderableAttributes;

const UseAttributes = {
    href: true,
    width: true,
    height: true,
    ...RenderableAttributes
};

const SymbolAttributes = {
    name: true,
    ...ViewBoxAttributes
};

const PathAttributes = {
    d: true,
    ...RenderableAttributes
};

const TextAttributes = {
    font: {
        diff: fontDiffer
    },
    textAnchor: true,
    deltaX: arrayDiffer,
    deltaY: arrayDiffer,
    positionX: true,
    positionY: true,
    ...RenderableAttributes
};

const TextPathAttributes = {
    href: true,
    startOffset: true,
    ...RenderableAttributes
};

const TSpanAttibutes = {
    content: true,
    ...TextAttributes
};

const ClipPathAttributes = {
    name: true
};

const GradientAttributes = {
    gradient: {
        diff: arrayDiffer
    },
    gradientUnits: true,
    gradientTransform: {
        diff: arrayDiffer
    },
    ...ClipPathAttributes
};

const LinearGradientAttributes = {
    x1: true,
    y1: true,
    x2: true,
    y2: true,
    ...GradientAttributes
};

const RadialGradientAttributes = {
    fx: true,
    fy: true,
    rx: true,
    ry: true,
    cx: true,
    cy: true,
    r: true,
    ...GradientAttributes
};


const CircleAttributes = {
    cx: true,
    cy: true,
    r: true,
    ...RenderableAttributes
};

const EllipseAttributes = {
    cx: true,
    cy: true,
    rx: true,
    ry: true,
    ...RenderableAttributes
};

const ImageAttributes = {
    x: true,
    y: true,
    width: true,
    height: true,
    src: true,
    align: true,
    meetOrSlice: true,
    ...RenderableAttributes
};

const LineAttributes = {
    x1: true,
    y1: true,
    x2: true,
    y2: true,
    ...RenderableAttributes
};

const RectAttributes = {
    x: true,
    y: true,
    width: true,
    height: true,
    rx: true,
    ry: true,
    ...RenderableAttributes
};

export {
    PathAttributes,
    TextAttributes,
    TSpanAttibutes,
    TextPathAttributes,
    GroupAttributes,
    ClipPathAttributes,
    CircleAttributes,
    EllipseAttributes,
    ImageAttributes,
    LineAttributes,
    RectAttributes,
    UseAttributes,
    SymbolAttributes,
    LinearGradientAttributes,
    RadialGradientAttributes,
    ViewBoxAttributes
};

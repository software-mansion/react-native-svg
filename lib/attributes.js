
function arrayDiffer(a, b) {
    if (!a || !b) {
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

function fontDiffer(a, b) {
    if (a === b) {
        return false;
    }

    return (
        a.fontStyle !== b.fontStyle ||
        a.fontVariant !== b.fontVariant ||
        a.fontWeight !== b.fontWeight ||
        a.fontStretch !== b.fontStretch ||
        a.fontSize !== b.fontSize ||
        a.fontFamily !== b.fontFamily ||
        a.textAnchor !== b.textAnchor ||
        a.textDecoration !== b.textDecoration ||
        a.letterSpacing !== b.letterSpacing ||
        a.wordSpacing !== b.wordSpacing ||
        a.kerning !== b.kerning ||
        a.fontVariantLigatures !== b.fontVariantLigatures ||
        a.fontData !== b.fontData ||
        a.fontFeatureSettings !== b.fontFeatureSettings
    );
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
    scaleX: true,
    scaleY: true,
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

const GroupAttributes = {
    ...RenderableAttributes,
    font: {
        diff: fontDiffer
    },
};

const UseAttributes = {
    ...RenderableAttributes,
    href: true,
    width: true,
    height: true,
};

const SymbolAttributes = {
    ...ViewBoxAttributes,
    name: true,
};

const PathAttributes = {
    ...RenderableAttributes,
    d: true,
};

const TextSpecificAttributes = {
    ...RenderableAttributes,
    alignmentBaseline: true,
    baselineShift: true,
    verticalAlign: true,
    lengthAdjust: true,
    textLength: true,
};

const TextAttributes = {
    ...TextSpecificAttributes,
    font: {
        diff: fontDiffer
    },
    deltaX: arrayDiffer,
    deltaY: arrayDiffer,
    rotate: arrayDiffer,
    positionX: arrayDiffer,
    positionY: arrayDiffer,
};

const TextPathAttributes = {
    ...TextSpecificAttributes,
    href: true,
    startOffset: true,
    method: true,
    spacing: true,
    side: true,
    midLine: true,
};

const TSpanAttibutes = {
    ...TextAttributes,
    content: true,
};

const ClipPathAttributes = {
    name: true
};

const GradientAttributes = {
    ...ClipPathAttributes,
    gradient: {
        diff: arrayDiffer
    },
    gradientUnits: true,
    gradientTransform: {
        diff: arrayDiffer
    },
};

const LinearGradientAttributes = {
    ...GradientAttributes,
    x1: true,
    y1: true,
    x2: true,
    y2: true,
};

const RadialGradientAttributes = {
    ...GradientAttributes,
    fx: true,
    fy: true,
    rx: true,
    ry: true,
    cx: true,
    cy: true,
    r: true,
};


const CircleAttributes = {
    ...RenderableAttributes,
    cx: true,
    cy: true,
    r: true,
};

const EllipseAttributes = {
    ...RenderableAttributes,
    cx: true,
    cy: true,
    rx: true,
    ry: true,
};

const ImageAttributes = {
    ...RenderableAttributes,
    x: true,
    y: true,
    width: true,
    height: true,
    src: true,
    align: true,
    meetOrSlice: true,
};

const LineAttributes = {
    ...RenderableAttributes,
    x1: true,
    y1: true,
    x2: true,
    y2: true,
};

const RectAttributes = {
    ...RenderableAttributes,
    x: true,
    y: true,
    width: true,
    height: true,
    rx: true,
    ry: true,
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

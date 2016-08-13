import _ from 'lodash';

const merge = _.assign;

function arrayDiffer(a, b) {
    if (_.isNil(a) || _.isNil(b) ) {
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

const ViewBoxAttributes = {
    minX: true,
    minY: true,
    vbWidth: true,
    vbHeight: true,
    align: true,
    meetOrSlice: true,
    name: true
};

const NodeAttributes = {
    name: true,
    matrix: {
        diff: arrayDiffer
    },
    opacity: true,
    clipRule: true,
    clipPathRef: true,
    clipPath: {
        diff: arrayDiffer
    },
    propList: {
        diff: arrayDiffer
    },
    responsible: true
};

const RenderableOnlyAttributes = {
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

const RenderableAttributes = merge({}, NodeAttributes, RenderableOnlyAttributes);

const GroupAttributes = RenderableAttributes;

const UseAttributes = merge({
    href: true,
    width: true,
    height: true
}, RenderableAttributes);

const PathAttributes = merge({
    d: {
        diff: arrayDiffer
    }
}, RenderableAttributes);

const TextAttributes = merge({
    alignment: true,
    frame: {
        diff: fontAndLinesDiffer
    },
    path: {
        diff: arrayDiffer
    }
}, RenderableAttributes);

const ClipPathAttributes = {
    name: true
};

const LinearGradientAttributes = merge({
    x1: true,
    y1: true,
    x2: true,
    y2: true,
    gradient: {
        diff: arrayDiffer
    }
}, ClipPathAttributes);

const RadialGradientAttributes = merge({
    fx: true,
    fy: true,
    rx: true,
    ry: true,
    cx: true,
    cy: true,
    r: true,
    gradient: {
        diff: arrayDiffer
    }
}, ClipPathAttributes);


const CircleAttributes = merge({
    cx: true,
    cy: true,
    r: true
}, RenderableAttributes);

const EllipseAttributes = merge({
    cx: true,
    cy: true,
    rx: true,
    ry: true
}, RenderableAttributes);

const ImageAttributes = merge({
    x: true,
    y: true,
    width: true,
    height: true,
    src: true,
    align: true,
    meetOrSlice: true
}, RenderableAttributes);

const LineAttributes = merge({
    x1: true,
    y1: true,
    x2: true,
    y2: true
}, RenderableAttributes);

const RectAttributes = merge({
    x: true,
    y: true,
    width: true,
    height: true,
    rx: true,
    ry: true
}, RenderableAttributes);

export {
    PathAttributes,
    TextAttributes,
    GroupAttributes,
    ClipPathAttributes,
    CircleAttributes,
    EllipseAttributes,
    ImageAttributes,
    LineAttributes,
    RectAttributes,
    UseAttributes,
    RenderableOnlyAttributes,
    LinearGradientAttributes,
    RadialGradientAttributes,
    ViewBoxAttributes
};

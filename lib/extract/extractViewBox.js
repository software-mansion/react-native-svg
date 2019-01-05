const meetOrSliceTypes = {
    meet: 0,
    slice: 1,
    none: 2,
};

const alignEnum = [
    "xMinYMin",
    "xMidYMin",
    "xMaxYMin",
    "xMinYMid",
    "xMidYMid",
    "xMaxYMid",
    "xMinYMax",
    "xMidYMax",
    "xMaxYMax",
    "none",
].reduce((prev, name) => {
    prev[name] = name;
    return prev;
}, {});

const spacesRegExp = /\s+/;

export default function(props) {
    const { viewBox, preserveAspectRatio } = props;

    if (!viewBox) {
        return null;
    }

    const params = viewBox
        .trim()
        .split(spacesRegExp)
        .map(Number);

    if (params.length === 4 && params.some(isNaN)) {
        console.warn("Invalid `viewBox` prop:" + viewBox);
        return null;
    }

    const modes = preserveAspectRatio
        ? preserveAspectRatio.trim().split(spacesRegExp)
        : [];

    const meetOrSlice = meetOrSliceTypes[modes[1]] || 0;
    const align = alignEnum[modes[0]] || "xMidYMid";
    const [minX, minY, vbWidth, vbHeight] = params;

    return {
        minX,
        minY,
        vbWidth,
        vbHeight,
        align,
        meetOrSlice,
    };
}

export { meetOrSliceTypes, alignEnum };

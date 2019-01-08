export const meetOrSliceTypes = {
    meet: 0,
    slice: 1,
    none: 2,
};

export const alignEnum = [
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

export default function extractViewBox(props) {
    const { viewBox, preserveAspectRatio } = props;

    if (!viewBox) {
        return null;
    }

    const params = viewBox
        .trim()
        .split(spacesRegExp)
        .map(Number);

    if (params.length !== 4 || params.some(isNaN)) {
        console.warn("Invalid `viewBox` prop:" + viewBox);
        return null;
    }
    const [minX, minY, vbWidth, vbHeight] = params;

    const modes = preserveAspectRatio
        ? preserveAspectRatio.trim().split(spacesRegExp)
        : [];

    return {
        minX,
        minY,
        vbWidth,
        vbHeight,
        align: alignEnum[modes[0]] || "xMidYMid",
        meetOrSlice: meetOrSliceTypes[modes[1]] || 0,
    };
}

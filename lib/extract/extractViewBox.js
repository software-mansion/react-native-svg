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

    const params = viewBox.trim().split(spacesRegExp);

    if (params.length === 4 && params.some(param => isNaN(+param))) {
        console.warn("Invalid `viewBox` prop:" + viewBox);
        return null;
    }

    const modes = preserveAspectRatio
        ? preserveAspectRatio.trim().split(spacesRegExp)
        : [];

    const meetOrSlice = meetOrSliceTypes[modes[1]] || 0;
    const align = alignEnum[modes[0]] || "xMidYMid";

    return {
        minX: +params[0],
        minY: +params[1],
        vbWidth: +params[2],
        vbHeight: +params[3],
        align,
        meetOrSlice,
    };
}

export { meetOrSliceTypes, alignEnum };

// Edge Mode Values
const SVG_EDGEMODE_UNKNOWN = 0;
const SVG_EDGEMODE_DUPLICATE = 1;
const SVG_EDGEMODE_WRAP = 2;
const SVG_EDGEMODE_NONE = 3;

const edgeModeValues = {
    duplicate: SVG_EDGEMODE_DUPLICATE,
    wrap: SVG_EDGEMODE_WRAP,
    none: SVG_EDGEMODE_NONE,
};

export default props => {
    const {
        x,
        y,
        in1,
        width,
        height,
        result,
        children,
        edgeMode,
        stdDeviation,
    } = props;
    const stdD = `${stdDeviation}`
        .replace(/,/gm, " ")
        .trim()
        .replace(/\s\s+/gm, " ")
        .split(" ");
    return {
        in1,
        result,
        children,
        x: `${x}`,
        y: `${y}`,
        filterwidth: `${width}`,
        filterheight: `${height}`,
        edgeMode: edgeModeValues[edgeMode] || SVG_EDGEMODE_UNKNOWN,
        stdDeviationX: stdD[0],
        stdDeviationY: stdD.length > 1 ? stdD[1] : stdD[0],
    };
};

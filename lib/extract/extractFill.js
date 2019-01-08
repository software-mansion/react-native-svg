import extractBrush from "./extractBrush";
import extractOpacity from "./extractOpacity";

const fillRules = {
    evenodd: 0,
    nonzero: 1,
};

const fillProps = ["fill", "fillOpacity", "fillRule"];

export default function extractFill(props, styleProperties) {
    for (const name of fillProps) {
        if (props.hasOwnProperty(name)) {
            styleProperties.push(name);
        }
    }

    return {
        // default fill is black
        fill: extractBrush(props.fill || "#000"),
        fillOpacity: extractOpacity(props.fillOpacity),
        fillRule: fillRules[props.fillRule] === 0 ? 0 : 1,
    };
}

import extractFill from "./extractFill";
import extractStroke from "./extractStroke";
import extractTransform, { props2transform } from "./extractTransform";
import extractClipPath from "./extractClipPath";
import extractResponder from "./extractResponder";
import extractOpacity from "./extractOpacity";

export default function(props, ref) {
    const styleProperties = [];

    const extractedProps = {
        opacity: extractOpacity(props.opacity),
        propList: styleProperties,
        onLayout: props.onLayout
    };

    if (props.id) {
        extractedProps.name = props.id;
    }

    if (props.clipPath) {
        Object.assign(extractedProps, extractClipPath(props));
    }

    Object.assign(extractedProps, extractStroke(props, styleProperties));
    Object.assign(extractedProps, extractFill(props, styleProperties));

    extractedProps.matrix = extractTransform(props);

    Object.assign(extractedProps, props2transform(props));

    Object.assign(extractedProps, extractResponder(props, ref));

    return extractedProps;
}

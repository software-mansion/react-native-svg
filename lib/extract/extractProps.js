import extractFill from "./extractFill";
import extractStroke from "./extractStroke";
import extractTransform, { props2transform } from "./extractTransform";
import extractClipPath from "./extractClipPath";
import extractResponder from "./extractResponder";
import extractOpacity from "./extractOpacity";
import urlRegex from "./patternReg";

export default function(prop, ref) {
    const props = { ...prop.style, ...prop };
    const { opacity, onLayout, id, clipPath, mask } = props;
    const styleProperties = [];

    const extractedProps = {
        opacity: extractOpacity(opacity),
        propList: styleProperties,
        onLayout,
    };

    if (id) {
        extractedProps.name = id;
    }

    if (clipPath) {
        Object.assign(extractedProps, extractClipPath(props));
    }

    if (mask) {
        const matched = mask.match(urlRegex);

        if (matched) {
            extractedProps.mask = matched[1];
        } else {
            console.warn(
                'Invalid `mask` prop, expected a mask like `"#id"`, but got: "' +
                    mask +
                    '"',
            );
        }
    }

    Object.assign(extractedProps, extractStroke(props, styleProperties));
    Object.assign(extractedProps, extractFill(props, styleProperties));

    extractedProps.matrix = extractTransform(props);

    Object.assign(extractedProps, props2transform(props));

    Object.assign(extractedProps, extractResponder(props, ref));

    return extractedProps;
}

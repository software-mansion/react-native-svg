import extractFill from "./extractFill";
import extractStroke from "./extractStroke";
import extractTransform, { props2transform } from "./extractTransform";
import extractClipPath from "./extractClipPath";
import extractResponder from "./extractResponder";
import extractOpacity from "./extractOpacity";
import { idPattern } from "../util";

export default function extractProps(prop, ref) {
    const props = { ...prop.style, ...prop };
    const { opacity, onLayout, id, clipPath, mask } = props;
    const styleProperties = [];

    const extractedProps = {
        onLayout,
        propList: styleProperties,
        opacity: extractOpacity(opacity),
        matrix: extractTransform(props),
        ...props2transform(props),
        ...extractResponder(props, ref),
        ...extractFill(props, styleProperties),
        ...extractStroke(props, styleProperties),
    };

    if (id) {
        extractedProps.name = id;
    }

    if (clipPath) {
        Object.assign(extractedProps, extractClipPath(props));
    }

    if (mask) {
        const matched = mask.match(idPattern);

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

    return extractedProps;
}

import extractFill from './extractFill';
import extractStroke from './extractStroke';
import extractTransform from './extractTransform';
import extractClipPath from './extractClipPath';
import extractResponder from './extractResponder';
import extractOpacity from './extractOpacity';

export default function(props, ref) {
    const styleProperties = [];

    const extractedProps = {
        opacity: extractOpacity(props.opacity),
        propList: styleProperties
    };

    if (props.id) {
        extractedProps.name = props.id;
    }

    if (props.clipPath) {
        Object.assign(extractedProps, extractClipPath(props));
    }

    Object.assign(extractedProps, extractStroke(props, styleProperties));
    Object.assign(extractedProps, extractFill(props, styleProperties));

    if (props.transform) {
        extractedProps.matrix = extractTransform(props.transform);
    } else {
        extractedProps.matrix = extractTransform(props);
    }

    Object.assign(extractedProps, extractResponder(props, ref));

    return extractedProps;
}

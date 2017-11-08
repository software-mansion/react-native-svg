import extractFill from './extractFill';
import extractStroke from './extractStroke';
import extractTransform, {props2transform, tp} from './extractTransform';
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

    extractedProps.matrix = extractTransform(props);

    Object.assign(extractedProps, props2transform(props));
    let transform = props.transform;
    if (transform) {
        if (typeof transform === 'string') {
            const transformParsed = tp.parse(transform);
            if (transformParsed.matrix) {
                // TODO: Extract scaling values for coordinate system
                // Especially scaleY for calculating scaling of fontSize
            } else {
                let trans = props2transform(transformParsed);
                if (typeof trans === 'object') {
                    Object.assign(extractedProps, trans);
                }
            }
        }
    }

    Object.assign(extractedProps, extractResponder(props, ref));

    return extractedProps;
}

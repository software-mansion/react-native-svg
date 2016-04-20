import extractFill from './extractFill';
import extractStroke from './extractStroke';
import extractTransform from './extractTransform';

export default function(props, options = {stroke: true, join: true, transform: true, fill: true}) {
    if (props.visible === false) {
        return {
            opacity: 0
        }
    }
    let extractedProps = {
        opacity: +props.opacity || 1
    };

    if (options.stroke) {
        Object.assign(extractedProps, extractStroke(props));
    }

    if (options.fill) {
        Object.assign(extractedProps, extractFill.call(this, props));
    }

    if (options.transform) {
        extractedProps.transform = extractTransform(props);
    }

    return extractedProps;
}

import extractFill from './extractFill';
import extractStroke from './extractStroke';
import extractTransform from './extractTransform';
import extractClipping from './extractClipping';
import _ from 'lodash';

export default function(props, options = {stroke: true, join: true, transform: true, fill: true}) {
    if (props.visible === false) {
        return {
            opacity: 0
        }
    }
    let extractedProps = {
        opacity: +props.opacity || 1
    };

    let dimensions = this.getBoundingBox ? this.getBoundingBox() : null;

    if (props.clipPath) {
        _.assign(extractedProps, extractClipping(props));
    }

    if (options.stroke) {
        _.assign(extractedProps, extractStroke(props, dimensions));
    }

    if (options.fill) {
        _.assign(extractedProps, extractFill(props, dimensions));
    }

    if (options.transform) {
        extractedProps.transform = extractTransform(props);
    }

    return extractedProps;
}

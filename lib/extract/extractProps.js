import extractFill from './extractFill';
import extractStroke from './extractStroke';
import extractTransform from './extractTransform';
import extractClipping from './extractClipping';
import extractResponder from './extractResponder';
import _ from 'lodash';

export default function(props, options = {stroke: true, transform: true, fill: true, responder: true}) {
    if (props.visible === false) {
        return {
            opacity: 0
        };
    }

    let extractedProps = {
        opacity: +props.opacity || 1
    };

    if (props.clipPath) {
        _.assign(extractedProps, extractClipping(props));
    }

    if (options.stroke) {
        _.assign(extractedProps, extractStroke(props));
    }

    if (options.fill) {
        _.assign(extractedProps, extractFill(props));
    }

    if (options.transform) {
        extractedProps.trans = extractTransform(props);
    }

    if (options.responder) {
        _.assign(extractedProps, extractResponder(props));
    }

    return extractedProps;
}

import extractFill from './extractFill';
import extractStroke from './extractStroke';
import extractTransform from './extractTransform';
import extractClipping from './extractClipping';
import extractResponder from './extractResponder';
import _ from 'lodash';

export default function(props, options = {stroke: true, transform: true, fill: true, responder: true}) {
    let extractedProps = {
        opacity: +props.opacity || 1
    };

    if (props.id) {
        extractedProps.name = props.id;
    }

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
        extractedProps.transform = extractTransform(props);
    } else if (props.transform) {
        // todo: add support for transform prop like this:
        // {scale: 1.5, translate: '10 10'}
        extractedProps.transform = props.transform;
    }

    if (options.responder) {
        _.assign(extractedProps, extractResponder(props));
    }

    return extractedProps;
}

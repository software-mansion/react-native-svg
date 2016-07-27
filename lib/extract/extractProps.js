import extractFill from './extractFill';
import extractStroke from './extractStroke';
import extractTransform from './extractTransform';
import extractClipping from './extractClipping';
import extractResponder from './extractResponder';
import extractOpacity from './extractOpacity';
import {RenderableOnlyAttributes} from '../attributes';
import _ from 'lodash';

export default function(props, options = {stroke: true, transform: true, fill: true, responder: true}) {
    let propList = [];
    Object.keys(RenderableOnlyAttributes).forEach(name => {
        if (!_.isNil(props[name])) {
            // clipPath prop may provide `clipPathRef` as native prop
            if (name === 'clipPath') {
                if (extractedProps[name]) {
                    propList.push(name);
                } else if (extractedProps.clipPathRef) {
                    propList.push('clipPathRef');
                }
            } else {
                propList.push(name);
            }
        }
    });

    let extractedProps = {
        opacity: extractOpacity(props.opacity),
        propList
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
        extractedProps.matrix = extractTransform(props);
    } else if (props.transform) {
        extractedProps.matrix = extractTransform(props.transform);
    }

    if (options.responder) {
        _.assign(extractedProps, extractResponder(props));
    }

    return extractedProps;
}

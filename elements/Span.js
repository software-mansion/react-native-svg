import React, {PropTypes} from 'react';
import createReactNativeComponentClass from 'react/lib/createReactNativeComponentClass';
import {SpanAttributes} from '../lib/attributes';
import Shape from './Shape';
import {pathProps, numberProp, fontProps} from '../lib/props';


// Span components are only for internal use for Text.
class Span extends Shape {
    static displayName = 'Span';

    static propTypes = {
        ...pathProps,
        frame: PropTypes.shape({
            content: PropTypes.string.isRequired,
            dx: numberProp,
            dy: numberProp,
            px: numberProp,
            py: numberProp,
            font: PropTypes.shape(fontProps)
        })
    };

    render() {
        return <RNSVGSpan
            {...this.extractProps({
                ...this.props,
                x: null,
                y: null
            })}
            {...this.props.frame}
        />;
    }
}

const RNSVGSpan = createReactNativeComponentClass({
    validAttributes: SpanAttributes,
    uiViewClassName: 'RNSVGSpan'
});

export default Span;

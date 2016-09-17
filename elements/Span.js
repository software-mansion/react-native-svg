import React, {PropTypes} from 'react';
import createReactNativeComponentClass from 'react/lib/createReactNativeComponentClass';
import {SpanAttributes} from '../lib/attributes';
import Shape from './Shape';
import {numberProp} from '../lib/props';


// Span components are only for internal use for Text.
class Span extends Shape {
    static displayName = 'Span';

    static propTypes = {
        content: PropTypes.string.isRequired,
        dx: numberProp,
        dy: numberProp,
        px: numberProp,
        py: numberProp
    };

    render() {
        return <RNSVGSpan {...this.props}/>;
    }
}

const RNSVGSpan = createReactNativeComponentClass({
    validAttributes: SpanAttributes,
    uiViewClassName: 'RNSVGSpan'
});

export default Span;

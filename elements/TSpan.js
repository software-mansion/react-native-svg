import React, {PropTypes} from 'react';
import createReactNativeComponentClass from 'react/lib/createReactNativeComponentClass';
import {numberProp, pathProps} from '../lib/props';
import {TSpanAttributes} from '../lib/attributes';
import extractFrame from '../lib/extract/extractFrame';
import Shape from './Shape';

class TSpan extends Shape {
    static displayName = 'TSpan';

    static propTypes = {
        ...pathProps,
        dx: numberProp,
        dy: numberProp,
        textAnchor: PropTypes.oneOf(['start', 'middle', 'end']),
        fontFamily: PropTypes.string,
        fontSize: numberProp,
        fontWeight: PropTypes.string,
        fontStyle: PropTypes.string,
        font: PropTypes.object
    };

    setNativeProps = (...args) => {
        this.root.setNativeProps(...args);
    };

    render() {
        return <RNSVGTSpan
            ref={ele => {this.root = ele;}}
            {...extractFrame(this.props)}
        />;
    }
}

const RNSVGTSpan = createReactNativeComponentClass({
    validAttributes: TSpanAttributes,
    uiViewClassName: 'RNSVGTSpan'
});

export default TSpan;

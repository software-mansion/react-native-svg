import React, { PropTypes, Component } from 'react';
import createReactNativeComponentClass from 'react-native/Libraries/Renderer/src/renderers/native/createReactNativeComponentClass';
import extractText from '../lib/extract/extractText';
import {numberProp, pathProps, fontProps} from '../lib/props';
import {TSpanAttibutes} from '../lib/attributes';
import Shape from './Shape';

// TSpan elements are shadow components
class TSpan extends Shape {
    static displayName = 'TSpan';

    static propTypes = {
        ...pathProps,
        ...fontProps,
        dx: numberProp,
        dy: numberProp,
        textAnchor: PropTypes.oneOf(['start', 'middle', 'end'])
    };

    setNativeProps = (...args) => {
        this.root.setNativeProps(...args);
    };

    render() {
        let props = this.props;
        return <RNSVGTSpan
            ref={ele => {this.root = ele;}}
            {...this.extractProps({
                ...props,
                x: null,
                y: null
            })}
            {...extractText(props)}
        />;
    }
}

const RNSVGTSpan = createReactNativeComponentClass({
    validAttributes: TSpanAttibutes,
    uiViewClassName: 'RNSVGTSpan'
});

export default TSpan;

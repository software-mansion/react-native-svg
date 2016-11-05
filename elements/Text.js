import React, {PropTypes} from 'react';
import createReactNativeComponentClass from 'react/lib/createReactNativeComponentClass';
import extractText from '../lib/extract/extractText';
import {numberProp, pathProps, fontProps} from '../lib/props';
import {TextAttributes} from '../lib/attributes';
import Shape from './Shape';
import TSpan from './TSpan';

class Text extends Shape {
    static displayName = 'Text';

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
        const props = this.props;

        return <RNSVGText
            ref={ele => {this.root = ele;}}
            {...this.extractProps({
                ...props,
                x: null,
                y: null
            })}
            {...extractText(props, true)}
        />;
    }
}

const RNSVGText = createReactNativeComponentClass({
    validAttributes: TextAttributes,
    uiViewClassName: 'RNSVGText'
});

export default Text;

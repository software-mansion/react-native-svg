import React, {PropTypes} from 'react';
import createReactNativeComponentClass from 'react/lib/createReactNativeComponentClass';
import extractText from '../lib/extract/extractText';
import {numberProp, pathProps} from '../lib/props';
import {TextAttributes} from '../lib/attributes';
import Shape from './Shape';

class Text extends Shape {
    static displayName = 'Text';

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
        let props = this.props;
        return <RNSVGText
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

const RNSVGText = createReactNativeComponentClass({
    validAttributes: TextAttributes,
    uiViewClassName: 'RNSVGText'
});

export default Text;

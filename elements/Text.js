import React from 'react';
import PropTypes from 'prop-types';
import createReactNativeComponentClass from 'react-native/Libraries/Renderer/shims/createReactNativeComponentClass';
import extractText from '../lib/extract/extractText';
import {numberProp, pathProps, fontProps} from '../lib/props';
import {TextAttributes} from '../lib/attributes';
import extractProps from '../lib/extract/extractProps';
import Shape from './Shape';

export default class extends Shape {
    static displayName = 'Text';

    static propTypes = {
        ...pathProps,
        ...fontProps,
        dx: numberProp,
        dy: numberProp,
        textAnchor: PropTypes.oneOf(['start', 'middle', 'end'])
    };

    static childContextTypes = {
        isInAParentText: React.PropTypes.bool
    };

    getChildContext() {
        return {
            isInAParentText: true
        };
    };

    getContextTypes() {
        return {
            isInAParentText: React.PropTypes.bool
        };
    };

    setNativeProps = (...args) => {
        this.root.setNativeProps(...args);
    };

    render() {
        const props = this.props;

        return <RNSVGText
            ref={ele => {this.root = ele;}}
            {...extractProps({
                ...props,
                x: null,
                y: null
            }, this)}
            {...extractText(props, true)}
        />;
    }
}

const RNSVGText = createReactNativeComponentClass({
    validAttributes: TextAttributes,
    uiViewClassName: 'RNSVGText'
});

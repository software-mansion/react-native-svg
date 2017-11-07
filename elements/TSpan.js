import React  from 'react';
import PropTypes from 'prop-types';
import createReactNativeComponentClass from '../lib/createReactNativeComponentClass';
import extractText from '../lib/extract/extractText';
import {numberProp, pathProps, fontProps} from '../lib/props';
import {TSpanAttibutes} from '../lib/attributes';
import extractProps from '../lib/extract/extractProps';
import Shape from './Shape';

// TSpan elements are shadow components
export default class extends Shape {
    static displayName = 'TSpan';

    static propTypes = {
        ...pathProps,
        ...fontProps,
        dx: numberProp,
        dy: numberProp,
        textAnchor: PropTypes.oneOf(['start', 'middle', 'end'])
    };

    static childContextTypes = {
        isInAParentText: PropTypes.bool
    };

    getChildContext() {
        return {
            isInAParentText: true
        };
    };

    getContextTypes() {
        return {
            isInAParentText: PropTypes.bool
        };
    };

    setNativeProps = (...args) => {
        this.root.setNativeProps(...args);
    };

    render() {
        let props = this.props;
        return <RNSVGTSpan
            ref={ele => {this.root = ele;}}
            {...extractProps({
                ...props,
                x: null,
                y: null
            }, this)}
            {...extractText(props)}
        />;
    }
}

const RNSVGTSpan = createReactNativeComponentClass('RNSVGTSpan', () => ({
    validAttributes: TSpanAttibutes,
    uiViewClassName: 'RNSVGTSpan'
}));

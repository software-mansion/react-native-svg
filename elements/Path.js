import React from 'react';
import PropTypes from 'prop-types';
import createReactNativeComponentClass from '../lib/createReactNativeComponentClass';
import {PathAttributes} from '../lib/attributes';
import Shape from './Shape';
import {pathProps} from '../lib/props';
import extractProps from '../lib/extract/extractProps';

export default class extends Shape {
    static displayName = 'Path';

    static propTypes = {
        ...pathProps,
        d: PropTypes.string.isRequired
    };

    setNativeProps = (...args) => {
        this.root.setNativeProps(...args);
    };

    render() {
        let props = this.props;

        return (
            <RNSVGPath
                ref={ele => {this.root = ele;}}
                {...extractProps(props, this)}
                d={props.d}
            />
        );
    }
}

const RNSVGPath = createReactNativeComponentClass('RNSVGPath', () => ({
    validAttributes: PathAttributes,
    uiViewClassName: 'RNSVGPath'
}));

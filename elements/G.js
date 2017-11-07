import React from 'react';
import createReactNativeComponentClass from '../lib/createReactNativeComponentClass';
import Shape from './Shape';
import {pathProps} from '../lib/props';
import {GroupAttributes} from '../lib/attributes';
import extractProps from '../lib/extract/extractProps';

export default class extends Shape{
    static displayName = 'G';

    static propTypes = pathProps;

    setNativeProps = (...args) => {
        this.root.setNativeProps(...args);
    };

    render() {
        let {props} = this;

        return <RNSVGGroup
            {...extractProps(props, this)}
            ref={ele => {this.root = ele;}}
        >
            {props.children}
        </RNSVGGroup>;
    }
}

const RNSVGGroup = createReactNativeComponentClass('RNSVGGroup', () => ({
    validAttributes: GroupAttributes,
    uiViewClassName: 'RNSVGGroup'
}));

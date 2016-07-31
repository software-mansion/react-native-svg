import React from 'react';
import createReactNativeComponentClass from 'react/lib/createReactNativeComponentClass';
import Shape from './Shape';
import {transformProps} from '../lib/props';
import {GroupAttributes} from '../lib/attributes';
import extractProps from '../lib/extract/extractProps';

class G extends Shape{
    static displayName = 'G';

    static propTypes = transformProps;

    setNativeProps = (...args) => {
        this.root.setNativeProps(...args);
    };

    render() {
        let {props} = this;

        return <RNSVGGroup
            {...this.extractProps(props)}
            ref={ele => {this.root = ele;}}
        >
            {props.children}
        </RNSVGGroup>;
    }
}

const RNSVGGroup = createReactNativeComponentClass({
    validAttributes: GroupAttributes,
    uiViewClassName: 'RNSVGGroup'
});

export default G;
export {
    RNSVGGroup as NativeGroup
};

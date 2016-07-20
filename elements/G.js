import React, {Component, PropTypes} from 'react';
import _ from 'lodash';
import createReactNativeComponentClass from 'react/lib/createReactNativeComponentClass';
import {transformProps} from '../lib/props';
import {GroupAttributes} from '../lib/attributes';
import extractProps from '../lib/extract/extractProps';

class G extends Component{
    static displayName = 'G';

    static propTypes = transformProps;

    setNativeProps = (...args) => {
        this.root.setNativeProps(...args);
    };

    render() {
        return <RNSVGGroup
            {...extractProps(this.props, {transform: true})}
            ref={ele => this.root = ele}
            asClipPath={this.props.asClipPath}
        >
            {this.props.children}
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

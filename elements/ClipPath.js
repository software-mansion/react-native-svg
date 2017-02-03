import React, {Component, PropTypes} from 'react';
import createReactNativeComponentClass from 'react-native/Libraries/Renderer/src/renderers/native/createReactNativeComponentClass';
import {ClipPathAttributes} from '../lib/attributes';

export default class extends Component{
    static displayName = 'ClipPath';
    static propTypes = {
        id: PropTypes.string.isRequired
    };

    render() {
        return <RNSVGClipPath name={this.props.id}>{this.props.children}</RNSVGClipPath>;
    }
}

const RNSVGClipPath = createReactNativeComponentClass({
    validAttributes: ClipPathAttributes,
    uiViewClassName: 'RNSVGClipPath'
});

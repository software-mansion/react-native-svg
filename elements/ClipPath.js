import React, {Component} from 'react';
import PropTypes from 'prop-types';
import createReactNativeComponentClass from 'react-native/Libraries/Renderer/shims/createReactNativeComponentClass.js';
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

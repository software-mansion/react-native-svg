import React, { Component } from 'react';
import createReactNativeComponentClass from 'react-native/Libraries/Renderer/shims/createReactNativeComponentClass.js';

export default class extends Component {
    static displayName = 'Defs';

    render() {
        return <RNSVGDefs>{this.props.children}</RNSVGDefs>;
    }
}

const RNSVGDefs = createReactNativeComponentClass({
    validAttributes: {},
    uiViewClassName: 'RNSVGDefs'
});

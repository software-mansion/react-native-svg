import React, { Component } from "react";
import { requireNativeComponent } from "react-native";

export default class extends Component {
    static displayName = "ClipPath";

    render() {
        const { id, children } = this.props;
        return <RNSVGClipPath name={id}>{children}</RNSVGClipPath>;
    }
}

const RNSVGClipPath = requireNativeComponent("RNSVGClipPath");

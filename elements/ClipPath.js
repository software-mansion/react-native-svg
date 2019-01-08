import React, { Component } from "react";
import { requireNativeComponent } from "react-native";
import extractClipPath from "../lib/extract/extractClipPath";

export default class ClipPath extends Component {
    static displayName = "ClipPath";

    render() {
        const { id, children } = this.props;
        return (
            <RNSVGClipPath
                ref={this.refMethod}
                name={id}
                {...extractClipPath(this.props)}
            >
                {children}
            </RNSVGClipPath>
        );
    }
}

const RNSVGClipPath = requireNativeComponent("RNSVGClipPath");

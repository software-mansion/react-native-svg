import React, { Component } from "react";
import { requireNativeComponent } from "react-native";
import extractClipPath from "../lib/extract/extractClipPath";

export default class extends Component {
    static displayName = "ClipPath";

    setNativeProps = (...args) => {
        this.root.setNativeProps(...args);
    };

    render() {
        const { id, children } = this.props;
        return (
            <RNSVGClipPath
                ref={ele => {
                    this.root = ele;
                }}
                name={id}
                {...extractClipPath(this.props)}
            >
                {children}
            </RNSVGClipPath>
        );
    }
}

const RNSVGClipPath = requireNativeComponent("RNSVGClipPath");

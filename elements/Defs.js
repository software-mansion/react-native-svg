import React, { Component } from "react";
import { requireNativeComponent } from "react-native";

export default class extends Component {
    static displayName = "Defs";

    render() {
        return <RNSVGDefs>{this.props.children}</RNSVGDefs>;
    }
}

const RNSVGDefs = requireNativeComponent("RNSVGDefs");

import React, { Component } from "react";
import PropTypes from "prop-types";
import { requireNativeComponent } from "react-native";
import { ClipPathAttributes } from "../lib/attributes";

export default class extends Component {
    static displayName = "ClipPath";
    static propTypes = {
        id: PropTypes.string.isRequired,
    };

    render() {
        const { id, children } = this.props;
        return <RNSVGClipPath name={id}>{children}</RNSVGClipPath>;
    }
}

const RNSVGClipPath = requireNativeComponent("RNSVGClipPath", null, {
    nativeOnly: ClipPathAttributes,
});

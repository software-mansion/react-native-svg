import React, { Component } from "react";
import PropTypes from "prop-types";
import { requireNativeComponent } from "react-native";
import { filterPrimitiveProps } from "../lib/props";
import { FilterPrimitiveStandardAttributes } from "../lib/attributes";
import extractFilterPrimitive from "../lib/extract/extractFilterPrimitive";

export default class extends Component {
    static displayName = "feMergeNodeElement";
    static propTypes = {
        ...filterPrimitiveProps,
        in1: PropTypes.string,
    };

    render() {
        return <RNSVGFEMergeNode {...extractFilterPrimitive(this.props)} />;
    }
}

const RNSVGFEMergeNode = requireNativeComponent("RNSVGFEMergeNode", null, {
    nativeOnly: {
        ...FilterPrimitiveStandardAttributes,
        in1: true,
    },
});

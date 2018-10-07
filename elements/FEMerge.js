import React, { Component } from "react";
import { requireNativeComponent } from "react-native";
import { filterPrimitiveProps } from "../lib/props";
import { FilterPrimitiveStandardAttributes } from "../lib/attributes";
import extractFilterPrimitive from "../lib/extract/extractFilterPrimitive";

export default class extends Component {
    static displayName = "feMerge";
    static propTypes = {
        ...filterPrimitiveProps,
    };

    render() {
        return <RNSVGFEMerge {...extractFilterPrimitive(this.props)} />;
    }
}

const RNSVGFEMerge = requireNativeComponent("RNSVGFEMerge", null, {
    nativeOnly: {
        ...FilterPrimitiveStandardAttributes,
    },
});

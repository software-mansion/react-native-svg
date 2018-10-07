import React, { Component } from "react";
import PropTypes from "prop-types";
import { requireNativeComponent } from "react-native";
import { numberProp, filterPrimitiveProps } from "../lib/props";
import { FilterPrimitiveStandardAttributes } from "../lib/attributes";
import extractFilterPrimitive from "../lib/extract/extractFilterPrimitive";

export default class extends Component {
    static displayName = "feGaussianBlur";
    static propTypes = {
        ...filterPrimitiveProps,
        in1: PropTypes.string,
        stdDeviation: numberProp,
        edgeMode: PropTypes.oneOf(["duplicate", "wrap", "none"]),
    };

    render() {
        return <RNSVGFEGaussianBlur {...extractFilterPrimitive(this.props)} />;
    }
}

const RNSVGFEGaussianBlur = requireNativeComponent(
    "RNSVGFEGaussianBlur",
    null,
    {
        nativeOnly: {
            ...FilterPrimitiveStandardAttributes,
            in1: true,
            stdDeviationX: true,
            stdDeviationY: true,
            edgeMode: true,
        },
    },
);

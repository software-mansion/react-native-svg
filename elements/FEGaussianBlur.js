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
        in: PropTypes.string,
        stdDeviation: numberProp
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
            in: true,
            stdDeviationX: true,
            stdDeviationY: true
        },
    },
);

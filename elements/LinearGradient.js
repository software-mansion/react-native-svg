import React, { Component } from "react";
import PropTypes from "prop-types";
import { numberProp } from "../lib/props";
import extractGradient from "../lib/extract/extractGradient";
import { requireNativeComponent } from "react-native";
import { LinearGradientAttributes } from "../lib/attributes";

export default class extends Component {
    static displayName = "LinearGradient";
    static propTypes = {
        x1: numberProp.isRequired,
        x2: numberProp.isRequired,
        y1: numberProp.isRequired,
        y2: numberProp.isRequired,
        gradientUnits: PropTypes.oneOf(["objectBoundingBox", "userSpaceOnUse"]),
        id: PropTypes.string.isRequired,
    };

    static defaultProps = {
        x1: "0%",
        y1: "0%",
        x2: "100%",
        y2: "0%",
    };

    render() {
        const { props } = this;
        const { x1, y1, x2, y2 } = props;
        return (
            <RNSVGLinearGradient
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                {...extractGradient(props)}
            />
        );
    }
}

const RNSVGLinearGradient = requireNativeComponent(
    "RNSVGLinearGradient",
    null,
    {
        nativeOnly: LinearGradientAttributes,
    },
);

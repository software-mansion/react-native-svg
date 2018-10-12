import React, { Component } from "react";
import PropTypes from "prop-types";
import { numberProp } from "../lib/props";
import extractGradient from "../lib/extract/extractGradient";
import { requireNativeComponent } from "react-native";
import { RadialGradientAttributes } from "../lib/attributes";

export default class extends Component {
    static displayName = "RadialGradient";
    static propTypes = {
        fx: numberProp.isRequired,
        fy: numberProp.isRequired,
        rx: numberProp,
        ry: numberProp,
        cx: numberProp.isRequired,
        cy: numberProp.isRequired,
        r: numberProp,
        gradientUnits: PropTypes.oneOf(["objectBoundingBox", "userSpaceOnUse"]),
        id: PropTypes.string.isRequired,
    };

    static defaultProps = {
        fx: "50%",
        fy: "50%",
        cx: "50%",
        cy: "50%",
        r: "50%",
    };

    render() {
        const { props } = this;
        const { fx, fy, rx, ry, r, cx, cy } = props;
        return (
            <RNSVGRadialGradient
                fx={fx}
                fy={fy}
                rx={rx || r}
                ry={ry || r}
                cx={cx}
                cy={cy}
                {...extractGradient(props)}
            />
        );
    }
}

const RNSVGRadialGradient = requireNativeComponent(
    "RNSVGRadialGradient",
    null,
    {
        nativeOnly: RadialGradientAttributes,
    },
);

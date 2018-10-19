import React, { Component } from "react";
import extractGradient from "../lib/extract/extractGradient";
import { requireNativeComponent } from "react-native";

export default class extends Component {
    static displayName = "RadialGradient";

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

const RNSVGRadialGradient = requireNativeComponent("RNSVGRadialGradient");

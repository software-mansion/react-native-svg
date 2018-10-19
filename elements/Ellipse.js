import React from "react";
import { requireNativeComponent } from "react-native";
import Shape from "./Shape";
import extractProps from "../lib/extract/extractProps";

export default class extends Shape {
    static displayName = "Ellipse";

    static defaultProps = {
        cx: 0,
        cy: 0,
        rx: 0,
        ry: 0,
    };

    setNativeProps = (...args) => {
        this.root.setNativeProps(...args);
    };

    render() {
        const { props } = this;
        const { cx, cy, rx, ry } = props;

        return (
            <RNSVGEllipse
                ref={ele => {
                    this.root = ele;
                }}
                {...extractProps(props, this)}
                cx={cx}
                cy={cy}
                rx={rx}
                ry={ry}
            />
        );
    }
}

const RNSVGEllipse = requireNativeComponent("RNSVGEllipse");

import React from "react";
import { requireNativeComponent } from "react-native";
import Shape from "./Shape";
import { pathProps, numberProp } from "../lib/props";
import { EllipseAttributes } from "../lib/attributes";
import extractProps from "../lib/extract/extractProps";

export default class extends Shape {
    static displayName = "Ellipse";

    static propTypes = {
        ...pathProps,
        cx: numberProp.isRequired,
        cy: numberProp.isRequired,
        rx: numberProp.isRequired,
        ry: numberProp.isRequired,
    };

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

const RNSVGEllipse = requireNativeComponent("RNSVGEllipse", null, {
    nativeOnly: EllipseAttributes,
});

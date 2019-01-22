import React from "react";
import { requireNativeComponent } from "react-native";
import extractTransform from "../lib/extract/extractTransform";
import units from "../lib/units";
import Shape from "./Shape";

export default class Mask extends Shape {
    static displayName = "Mask";

    render() {
        const { props } = this;
        const {
            maskTransform,
            transform,
            id,
            x,
            y,
            width,
            height,
            maskUnits,
            maskContentUnits,
            children,
        } = props;
        return (
            <RNSVGMask
                ref={this.refMethod}
                name={id}
                x={x}
                y={y}
                width={width}
                height={height}
                maskTransform={extractTransform(maskTransform || transform || props)}
                maskUnits={maskUnits !== undefined ? units[maskUnits] : 0}
                maskContentUnits={
                    maskContentUnits !== undefined ? units[maskContentUnits] : 1
                }
            >
                {children}
            </RNSVGMask>
        );
    }
}

const RNSVGMask = requireNativeComponent("RNSVGMask");

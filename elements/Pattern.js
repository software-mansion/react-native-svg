import React, { Component } from "react";
import { requireNativeComponent } from "react-native";
import extractTransform from "../lib/extract/extractTransform";
import extractViewBox from "../lib/extract/extractViewBox";
import units from "../lib/units";

export default class Pattern extends Component {
    static displayName = "Pattern";

    render() {
        const { props } = this;
        const {
            patternTransform,
            transform,
            id,
            x,
            y,
            width,
            height,
            patternUnits,
            patternContentUnits,
            children,
            viewBox,
            preserveAspectRatio,
        } = props;
        return (
            <RNSVGPattern
                ref={this.refMethod}
                name={id}
                x={x}
                y={y}
                width={width}
                height={height}
                patternTransform={extractTransform(patternTransform || transform || props)}
                patternUnits={units[patternUnits] || 0}
                patternContentUnits={
                    patternContentUnits ? units[patternContentUnits] : 1
                }
                {...extractViewBox({ viewBox, preserveAspectRatio })}
            >
                {children}
            </RNSVGPattern>
        );
    }
}

const RNSVGPattern = requireNativeComponent("RNSVGPattern");

import React, { Component } from "react";
import { requireNativeComponent } from "react-native";
import extractTransform from "../lib/extract/extractTransform";
import units from "../lib/units";

export default class Mask extends Component {
    static displayName = "Mask";

    setNativeProps = props => {
        this.root.setNativeProps(props);
    };

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
                ref={ele => {
                    this.root = ele;
                }}
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

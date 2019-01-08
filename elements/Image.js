import React from "react";
import { Image, requireNativeComponent } from "react-native";
import { meetOrSliceTypes, alignEnum } from "../lib/extract/extractViewBox";
import extractProps from "../lib/extract/extractProps";
import Shape from "./Shape";

const spacesRegExp = /\s+/;

export default class Image extends Shape {
    static displayName = "Image";

    static defaultProps = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        preserveAspectRatio: "xMidYMid meet",
    };

    setNativeProps = props => {
        this.root.setNativeProps(props);
    };

    render() {
        const { props } = this;
        const { preserveAspectRatio, x, y, width, height, href } = props;
        const modes = preserveAspectRatio.trim().split(spacesRegExp);
        return (
            <RNSVGImage
                ref={ele => {
                    this.root = ele;
                }}
                {...extractProps({ ...props, x: null, y: null }, this)}
                x={x}
                y={y}
                width={width}
                height={height}
                meetOrSlice={meetOrSliceTypes[modes[1]] || 0}
                align={alignEnum[modes[0]] || "xMidYMid"}
                src={Image.resolveAssetSource(href)}
            />
        );
    }
}

const RNSVGImage = requireNativeComponent("RNSVGImage");

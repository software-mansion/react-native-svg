import React from "react";
import PropTypes from "prop-types";
import { Image, requireNativeComponent } from "react-native";
import { ImageAttributes } from "../lib/attributes";
import { numberProp, touchableProps, responderProps } from "../lib/props";
import Shape from "./Shape";
import { meetOrSliceTypes, alignEnum } from "../lib/extract/extractViewBox";
import extractProps from "../lib/extract/extractProps";

const spacesRegExp = /\s+/;

export default class extends Shape {
    static displayName = "Image";
    static propTypes = {
        ...responderProps,
        ...touchableProps,
        x: numberProp,
        y: numberProp,
        width: numberProp.isRequired,
        height: numberProp.isRequired,
        preserveAspectRatio: PropTypes.string,
    };

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
        const meetOrSlice = meetOrSliceTypes[modes[1]] || 0;
        const align = alignEnum[modes[0]] || "xMidYMid";

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
                meetOrSlice={meetOrSlice}
                align={align}
                src={Image.resolveAssetSource(href)}
            />
        );
    }
}

const RNSVGImage = requireNativeComponent("RNSVGImage", null, {
    nativeOnly: ImageAttributes,
});

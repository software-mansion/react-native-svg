import React from "react";
import { requireNativeComponent } from "react-native";
import Shape from "./Shape";
import extractProps from "../lib/extract/extractProps";
import { extractFont } from "../lib/extract/extractText";
import extractTransform from "../lib/extract/extractTransform";

export default class extends Shape {
    static displayName = "G";

    setNativeProps = props => {
        const matrix = !props.matrix && extractTransform(props);
        if (matrix) {
            props.matrix = matrix;
        }
        this.root.setNativeProps(props);
    };

    render() {
        const { props } = this;

        return (
            <RNSVGGroup
                {...extractProps(props, this)}
                font={extractFont(props)}
                ref={ele => {
                    this.root = ele;
                }}
            >
                {props.children}
            </RNSVGGroup>
        );
    }
}

const RNSVGGroup = requireNativeComponent("RNSVGGroup");

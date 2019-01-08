import React from "react";
import { requireNativeComponent } from "react-native";
import extractProps from "../lib/extract/extractProps";
import { extractFont } from "../lib/extract/extractText";
import extractTransform from "../lib/extract/extractTransform";
import Shape from "./Shape";

export default class G extends Shape {
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
                ref={this.refMethod}
                {...extractProps(props, this)}
                font={extractFont(props)}
            >
                {props.children}
            </RNSVGGroup>
        );
    }
}

const RNSVGGroup = requireNativeComponent("RNSVGGroup");

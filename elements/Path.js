import React from "react";
import { requireNativeComponent } from "react-native";
import Shape from "./Shape";
import extractProps from "../lib/extract/extractProps";

export default class extends Shape {
    static displayName = "Path";

    setNativeProps = (...args) => {
        this.root.setNativeProps(...args);
    };

    render() {
        const { props } = this;

        return (
            <RNSVGPath
                ref={ele => {
                    this.root = ele;
                }}
                {...extractProps(props, this)}
                d={props.d}
            />
        );
    }
}

const RNSVGPath = requireNativeComponent("RNSVGPath");

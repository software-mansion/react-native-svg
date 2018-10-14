import React, { Component } from "react";
import extractViewBox from "../lib/extract/extractViewBox";
import { requireNativeComponent } from "react-native";

export default class extends Component {
    static displayName = "Symbol";

    render() {
        const { props } = this;
        const { id, children } = props;

        return (
            <RNSVGSymbol name={id} {...extractViewBox(props)}>
                {children}
            </RNSVGSymbol>
        );
    }
}

const RNSVGSymbol = requireNativeComponent("RNSVGSymbol");

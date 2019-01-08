import React, { Component } from "react";
import { requireNativeComponent } from "react-native";
import extractViewBox from "../lib/extract/extractViewBox";

export default class Symbol extends Component {
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

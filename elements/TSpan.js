import React from "react";
import { requireNativeComponent } from "react-native";
import extractProps from "../lib/extract/extractProps";
import extractTransform from "../lib/extract/extractTransform";
import extractText, { setTSpan } from "../lib/extract/extractText";
import { pickNotNil } from "../lib/util";
import Shape from "./Shape";

export default class TSpan extends Shape {
    static displayName = "TSpan";

    setNativeProps = props => {
        const matrix = !props.matrix && extractTransform(props);
        if (matrix) {
            props.matrix = matrix;
        }
        const text = pickNotNil(extractText(props, false));
        this.root.setNativeProps({
            ...props,
            ...text,
        });
    };

    render() {
        const props = this.props;
        return (
            <RNSVGTSpan
                ref={this.refMethod}
                {...extractProps(
                    {
                        ...props,
                        x: null,
                        y: null,
                    },
                    this,
                )}
                {...extractText(props, false)}
            />
        );
    }
}

setTSpan(TSpan);

const RNSVGTSpan = requireNativeComponent("RNSVGTSpan");

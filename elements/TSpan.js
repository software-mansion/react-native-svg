import React from "react";
import _ from "lodash";
import { requireNativeComponent } from "react-native";
import extractText from "../lib/extract/extractText";
import { textProps } from "../lib/props";
import { TSpanAttibutes } from "../lib/attributes";
import extractProps from "../lib/extract/extractProps";
import extractTransform from "../lib/extract/extractTransform";
import Shape from "./Shape";

// TSpan elements are shadow components
export default class extends Shape {
    static displayName = "TSpan";

    static propTypes = textProps;

    setNativeProps = props => {
        const matrix = !props.matrix && extractTransform(props);
        if (matrix) {
            props.matrix = matrix;
        }
        const text = _.pickBy(extractText(props, true), p => !_.isNil(p));
        this.root.setNativeProps({
            ...props,
            ...text,
        });
    };

    render() {
        const props = this.props;
        return (
            <RNSVGTSpan
                ref={ele => {
                    this.root = ele;
                }}
                {...extractProps(
                    {
                        ...props,
                        x: null,
                        y: null,
                    },
                    this,
                )}
                {...extractText(props)}
            />
        );
    }
}

const RNSVGTSpan = requireNativeComponent("RNSVGTSpan", null, {
    nativeOnly: TSpanAttibutes,
});

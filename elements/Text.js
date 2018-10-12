import React from "react";
import _ from "lodash";
import { requireNativeComponent } from "react-native";
import extractText from "../lib/extract/extractText";
import { textProps } from "../lib/props";
import { TextAttributes } from "../lib/attributes";
import extractProps from "../lib/extract/extractProps";
import extractTransform from "../lib/extract/extractTransform";
import Shape from "./Shape";

export default class extends Shape {
    static displayName = "Text";

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
            <RNSVGText
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
                {...extractText(props, true)}
            />
        );
    }
}

const RNSVGText = requireNativeComponent("RNSVGText", null, {
    nativeOnly: TextAttributes,
});

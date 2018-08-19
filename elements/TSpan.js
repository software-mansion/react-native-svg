import React from "react";
import PropTypes from "prop-types";
import { requireNativeComponent } from "react-native";
import extractText from "../lib/extract/extractText";
import { textProps } from "../lib/props";
import { TSpanAttibutes } from "../lib/attributes";
import extractProps from "../lib/extract/extractProps";
import Shape from "./Shape";

// TSpan elements are shadow components
export default class extends Shape {
    static displayName = "TSpan";

    static propTypes = textProps;

    //noinspection JSUnusedGlobalSymbols
    static childContextTypes = {
        isInAParentText: PropTypes.bool
    };

    //noinspection JSUnusedGlobalSymbols
    getChildContext() {
        return {
            isInAParentText: true
        };
    }

    //noinspection JSUnusedGlobalSymbols
    getContextTypes() {
        return {
            isInAParentText: PropTypes.bool
        };
    }

    setNativeProps = (...args) => {
        this.root.setNativeProps(...args);
    };

    render() {
        let props = this.props;
        return (
            <RNSVGTSpan
                ref={ele => {
                    this.root = ele;
                }}
                {...extractProps(
                    {
                        ...props,
                        x: null,
                        y: null
                    },
                    this
                )}
                {...extractText(props)}
            />
        );
    }
}

const RNSVGTSpan = requireNativeComponent("RNSVGTSpan", null, {
    nativeOnly: TSpanAttibutes
});

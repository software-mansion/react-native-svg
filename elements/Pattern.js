import React, { Component } from "react";
import PropTypes from "prop-types";
import { requireNativeComponent } from "react-native";
import { numberProp } from "../lib/props";
import units from "../lib/units";
import { PatternAttributes } from "../lib/attributes";
import extractTransform from "../lib/extract/extractTransform";
import extractViewBox from "../lib/extract/extractViewBox";

export default class extends Component {
    static displayName = "Pattern";
    static propTypes = {
        id: PropTypes.string.isRequired,
        x: numberProp,
        y: numberProp,
        width: numberProp,
        height: numberProp,
        patternTransform: PropTypes.string,
        patternUnits: PropTypes.oneOf(["userSpaceOnUse", "objectBoundingBox"]),
        patternContentUnits: PropTypes.oneOf([
            "userSpaceOnUse",
            "objectBoundingBox",
        ]),
        viewBox: PropTypes.string,
        preserveAspectRatio: PropTypes.string,
    };

    setNativeProps = props => {
        this.root.setNativeProps(props);
    };

    render() {
        const { props } = this;
        const {
            patternTransform,
            transform,
            id,
            x,
            y,
            width,
            height,
            patternUnits,
            patternContentUnits,
            children,
            viewBox,
            preserveAspectRatio,
        } = props;

        let extractedTransform;
        if (patternTransform) {
            extractedTransform = extractTransform(patternTransform);
        } else if (transform) {
            extractedTransform = extractTransform(transform);
        } else {
            extractedTransform = extractTransform(props);
        }

        return (
            <RNSVGPattern
                ref={ele => {
                    this.root = ele;
                }}
                name={id}
                x={x}
                y={y}
                width={width}
                height={height}
                matrix={extractedTransform}
                patternTransform={extractedTransform}
                patternUnits={units[patternUnits] || 0}
                patternContentUnits={
                    patternContentUnits ? units[patternContentUnits] : 1
                }
                {...extractViewBox({ viewBox, preserveAspectRatio })}
            >
                {children}
            </RNSVGPattern>
        );
    }
}

const RNSVGPattern = requireNativeComponent("RNSVGPattern", null, {
    nativeOnly: PatternAttributes,
});

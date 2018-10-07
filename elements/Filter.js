import React, { Component } from "react";
import PropTypes from "prop-types";
import { requireNativeComponent } from "react-native";
import { numberProp } from "../lib/props";
import PATTERN_UNITS from "../lib/PATTERN_UNITS";
import { FilterAttributes } from "../lib/attributes";

export default class extends Component {
    static displayName = "Filter";
    static propTypes = {
        id: PropTypes.string.isRequired,
        x: numberProp,
        y: numberProp,
        width: numberProp,
        height: numberProp,
        filterUnits: PropTypes.oneOf(["userSpaceOnUse", "objectBoundingBox"]),
        primitiveUnits: PropTypes.oneOf([
            "userSpaceOnUse",
            "objectBoundingBox",
        ]),
    };

    render() {
        const { props } = this;
        const {
            id,
            x,
            y,
            width,
            height,
            filterUnits,
            primitiveUnits,
            children,
        } = props;

        return (
            <RNSVGFilter
                name={id}
                x={`${x}`}
                y={`${y}`}
                filterwidth={`${width}`}
                filterheight={`${height}`}
                filterUnits={
                    filterUnits !== undefined ? PATTERN_UNITS[filterUnits] : 0
                }
                primitiveUnits={
                    primitiveUnits !== undefined
                        ? PATTERN_UNITS[primitiveUnits]
                        : 1
                }
            >
                {children}
            </RNSVGFilter>
        );
    }
}

const RNSVGFilter = requireNativeComponent("RNSVGFilter", null, {
    nativeOnly: FilterAttributes,
});

//noinspection JSUnresolvedVariable
import React, { Component } from "react";
import PropTypes from "prop-types";
import {
    ViewPropTypes,
    requireNativeComponent,
    StyleSheet,
    findNodeHandle,
    NativeModules
} from "react-native";
import extractViewBox from "../lib/extract/extractViewBox";
import { ViewBoxAttributes } from "../lib/attributes";
import { numberProp } from "../lib/props";

/** @namespace NativeModules.RNSVGSvgViewManager */
const RNSVGSvgViewManager = NativeModules.RNSVGSvgViewManager;

// Svg - Root node of all Svg elements
let id = 0;

const styles = StyleSheet.create({
    svg: {
        backgroundColor: "transparent"
    }
});

class Svg extends Component {
    static displayName = "Svg";
    static propTypes = {
        ...ViewPropTypes,
        opacity: numberProp,
        width: numberProp,
        height: numberProp,
        // more detail https://svgwg.org/svg2-draft/coords.html#ViewBoxAttribute
        viewBox: PropTypes.string,
        preserveAspectRatio: PropTypes.string
    };

    static defaultProps = {
        preserveAspectRatio: "xMidYMid meet"
    };

    constructor() {
        super(...arguments);
        this.id = ++id;
    }
    measureInWindow = (...args) => {
        this.root.measureInWindow(...args);
    };

    measure = (...args) => {
        this.root.measure(...args);
    };

    measureLayout = (...args) => {
        this.root.measureLayout(...args);
    };

    setNativeProps = (...args) => {
        this.root.setNativeProps(...args);
    };

    toDataURL = callback => {
        callback &&
            RNSVGSvgViewManager.toDataURL(findNodeHandle(this.root), callback);
    };

    render() {
        const {
            opacity,
            width,
            height,
            viewBox,
            preserveAspectRatio,
            style,
            ...props
        } = this.props;
        let dimensions;

        if (width && height) {
            dimensions = {
                width: width[width.length - 1] === "%" ? width : +width,
                height: height[height.length - 1] === "%" ? height : +height,
                flex: 0
            };
        }

        const w = `${width}`;
        const h = `${height}`;

        return (
            <NativeSvgView
                {...props}
                bbWidth={w}
                bbHeight={h}
                {...extractViewBox({ viewBox, preserveAspectRatio })}
                ref={ele => {
                    this.root = ele;
                }}
                style={[
                    styles.svg,
                    style,
                    !isNaN(+opacity) && {
                        opacity: +opacity
                    },
                    dimensions
                ]}
            />
        );
    }
}

const NativeSvgView = requireNativeComponent("RNSVGSvgView", null, {
    nativeOnly: {
        ...ViewBoxAttributes,
        width: true,
        height: true
    }
});

export default Svg;

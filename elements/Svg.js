//noinspection JSUnresolvedVariable
import React from "react";
import {
    requireNativeComponent,
    StyleSheet,
    findNodeHandle,
    NativeModules,
} from "react-native";
import extractResponder from "../lib/extract/extractResponder";
import extractViewBox from "../lib/extract/extractViewBox";
import Shape from "./Shape";
import G from "./G";

/** @namespace NativeModules.RNSVGSvgViewManager */
const RNSVGSvgViewManager = NativeModules.RNSVGSvgViewManager;

// Svg - Root node of all Svg elements
let id = 0;

const styles = StyleSheet.create({
    svg: {
        backgroundColor: "transparent",
        borderWidth: 0,
    },
});

class Svg extends Shape {
    static displayName = "Svg";

    static defaultProps = {
        preserveAspectRatio: "xMidYMid meet",
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

    setNativeProps = props => {
        if (props.width) {
            props.bbWidth = `${props.width}`;
        }
        if (props.height) {
            props.bbHeight = `${props.height}`;
        }
        this.root.setNativeProps(props);
    };

    toDataURL = callback => {
        callback &&
            RNSVGSvgViewManager.toDataURL(findNodeHandle(this.root), callback);
    };

    render() {
        const {
            opacity,
            viewBox,
            preserveAspectRatio,
            style,
            children,
            ...props
        } = this.props;
        const stylesAndProps = { ...(style && style.length ? Object.assign({}, ...style) : style), ...props };
        const { color, width, height } = stylesAndProps;

        let dimensions;
        if (width && height) {
            dimensions = {
                width: width[width.length - 1] === "%" ? width : +width,
                height: height[height.length - 1] === "%" ? height : +height,
                flex: 0,
            };
        }

        const w = `${width}`;
        const h = `${height}`;

        return (
            <NativeSvgView
                {...props}
                bbWidth={w}
                bbHeight={h}
                tintColor={color}
                {...extractResponder(props, this)}
                {...extractViewBox({ viewBox, preserveAspectRatio })}
                ref={ele => {
                    this.root = ele;
                }}
                style={[
                    styles.svg,
                    style,
                    !isNaN(+opacity) && {
                        opacity: +opacity,
                    },
                    dimensions,
                ]}
            >
                <G style={style} {...props}>
                    {children}
                </G>
            </NativeSvgView>
        );
    }
}

const NativeSvgView = requireNativeComponent("RNSVGSvgView");

export default Svg;

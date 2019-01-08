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

const RNSVGSvgViewManager = NativeModules.RNSVGSvgViewManager;

const styles = StyleSheet.create({
    svg: {
        backgroundColor: "transparent",
        borderWidth: 0,
    },
});

export default class Svg extends Shape {
    static displayName = "Svg";

    static defaultProps = {
        preserveAspectRatio: "xMidYMid meet",
    };

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
        const { width, height } = props;
        if (width) {
            props.bbWidth = String(width);
        }
        if (height) {
            props.bbHeight = String(height);
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
            onLayout,
            ...props
        } = this.props;
        const stylesAndProps = {
            ...(style && style.length ? Object.assign({}, ...style) : style),
            ...props,
        };
        const {
            color,
            width,
            height,

            // Inherited G properties
            font,
            transform,
            fill,
            fillOpacity,
            fillRule,
            stroke,
            strokeWidth,
            strokeOpacity,
            strokeDasharray,
            strokeDashoffset,
            strokeLinecap,
            strokeLinejoin,
            strokeMiterlimit,
        } = stylesAndProps;

        const dimensions = width && height ? {
            width: width[width.length - 1] === "%" ? width : +width,
            height: height[height.length - 1] === "%" ? height : +height,
            flex: 0,
        } : null;

        return (
            <NativeSvgView
                {...props}
                tintColor={color}
                onLayout={onLayout}
                bbWidth={String(width)}
                bbHeight={String(height)}
                {...extractResponder(props, this)}
                {...extractViewBox({ viewBox, preserveAspectRatio })}
                ref={this.refMethod}
                style={[
                    styles.svg,
                    style,
                    !isNaN(+opacity) && {
                        opacity: +opacity,
                    },
                    dimensions,
                ]}
            >
                <G
                    {...{
                        children,
                        style,
                        font,
                        transform,
                        fill,
                        fillOpacity,
                        fillRule,
                        stroke,
                        strokeWidth,
                        strokeOpacity,
                        strokeDasharray,
                        strokeDashoffset,
                        strokeLinecap,
                        strokeLinejoin,
                        strokeMiterlimit,
                    }}
                />
            </NativeSvgView>
        );
    }
}

const NativeSvgView = requireNativeComponent("RNSVGSvgView");

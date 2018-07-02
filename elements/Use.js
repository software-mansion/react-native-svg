import React from "react";
import PropTypes from "prop-types";
import { requireNativeComponent } from "react-native";
import extractProps from "../lib/extract/extractProps";
import { pathProps, numberProp } from "../lib/props";
import { UseAttributes } from "../lib/attributes";
import Shape from "./Shape";

const idExpReg = /^#(.+)$/;
export default class extends Shape {
    static displayName = "Use";

    static propTypes = {
        href: PropTypes.string.isRequired,
        width: numberProp, // Just for reusing `Symbol`
        height: numberProp, //  Just for reusing `Symbol`
        ...pathProps
    };

    static defaultProps = {
        width: 0,
        height: 0
    };

    setNativeProps = (...args) => {
        this.root.setNativeProps(...args);
    };

    render() {
        const { props } = this;
        const { children, width, height } = props;
        // match "url(#pattern)"
        const matched = props.href.match(idExpReg);
        let href;

        if (matched) {
            href = matched[1];
        }

        if (!href) {
            console.warn(
                'Invalid `href` prop for `Use` element, expected a href like `"#id"`, but got: "' +
                    props.href +
                    '"'
            );
        }

        return (
            <RNSVGUse
                ref={ele => {
                    this.root = ele;
                }}
                {...extractProps(props, this)}
                href={href}
                width={width !== undefined ? width.toString() : ""}
                height={height !== undefined ? height.toString() : ""}
            >
                {children}
            </RNSVGUse>
        );
    }
}

const RNSVGUse = requireNativeComponent("RNSVGUse", null, {
    nativeOnly: UseAttributes
});

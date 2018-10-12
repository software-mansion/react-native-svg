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
        ...pathProps,
    };

    static defaultProps = {
        width: 0,
        height: 0,
    };

    setNativeProps = props => {
        this.root.setNativeProps(props);
    };

    render() {
        const { props } = this;
        const { children, width, height, href } = props;

        // match "url(#pattern)"
        const matched = href.match(idExpReg);
        const match = matched && matched[1];

        if (!match) {
            console.warn(
                'Invalid `href` prop for `Use` element, expected a href like `"#id"`, but got: "' +
                    href +
                    '"',
            );
        }

        return (
            <RNSVGUse
                ref={ele => {
                    this.root = ele;
                }}
                {...extractProps(props, this)}
                href={match}
                width={width}
                height={height}
            >
                {children}
            </RNSVGUse>
        );
    }
}

const RNSVGUse = requireNativeComponent("RNSVGUse", null, {
    nativeOnly: UseAttributes,
});

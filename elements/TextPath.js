import React from "react";

import { requireNativeComponent } from "react-native";
import extractText from "../lib/extract/extractText";
import Shape from "./Shape";
import extractProps from "../lib/extract/extractProps";
import TSpan from "./TSpan";

const idExpReg = /^#(.+)$/;

export default class extends Shape {
    static displayName = "TextPath";

    render() {
        const {
            children,
            href,
            startOffset,
            method,
            spacing,
            side,
            alignmentBaseline,
            midLine,
            ...props
        } = this.props;
        const matched = href && href.match(idExpReg);
        const match = matched && matched[1];
        if (href && match) {
            return (
                <RNSVGTextPath
                    {...{
                        href: match,
                        startOffset: startOffset || 0,
                        method,
                        spacing,
                        side,
                        alignmentBaseline,
                        midLine,
                    }}
                    {...extractProps(
                        {
                            ...props,
                            x: null,
                            y: null,
                        },
                        this,
                    )}
                    {...extractText(
                        {
                            children,
                        },
                        true,
                        TSpan,
                    )}
                />
            );
        }

        console.warn(
            'Invalid `href` prop for `TextPath` element, expected a href like `"#id"`, but got: "' +
                href +
                '"',
        );
        return <TSpan>{children}</TSpan>;
    }
}

const RNSVGTextPath = requireNativeComponent("RNSVGTextPath");

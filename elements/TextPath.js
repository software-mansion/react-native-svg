import React from "react";

import { requireNativeComponent } from "react-native";
import { TextPathAttributes } from "../lib/attributes";
import extractText from "../lib/extract/extractText";
import Shape from "./Shape";
import { textPathProps } from "../lib/props";
import extractProps from "../lib/extract/extractProps";
import TSpan from "./TSpan";

const idExpReg = /^#(.+)$/;

export default class extends Shape {
    static displayName = "TextPath";

    static propTypes = textPathProps;

    render() {
        let {
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
        if (href) {
            let matched = href.match(idExpReg);

            if (matched) {
                href = matched[1];
                startOffset = `${startOffset || 0}`;
                return (
                    <RNSVGTextPath
                        {...{
                            href,
                            startOffset,
                            method,
                            spacing,
                            side,
                            alignmentBaseline,
                            midLine
                        }}
                        {...extractProps(
                            {
                                ...props,
                                x: null,
                                y: null
                            },
                            this
                        )}
                        {...extractText(
                            {
                                children
                            },
                            true
                        )}
                    />
                );
            }
        }

        console.warn(
            'Invalid `href` prop for `TextPath` element, expected a href like `"#id"`, but got: "' +
                props.href +
                '"'
        );
        return <TSpan>{children}</TSpan>;
    }
}

const RNSVGTextPath = requireNativeComponent("RNSVGTextPath", null, {
    nativeOnly: TextPathAttributes
});

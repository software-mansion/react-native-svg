import React from 'react';
import PropTypes from 'prop-types';
import createReactNativeComponentClass from 'react-native/Libraries/Renderer/shims/createReactNativeComponentClass.js';
import {TextPathAttributes} from '../lib/attributes';
import extractText from '../lib/extract/extractText';
import Shape from './Shape';
import {pathProps, fontProps, numberProp} from '../lib/props';
import extractProps from '../lib/extract/extractProps';
import TSpan from './TSpan';

const idExpReg = /^#(.+)$/;

export default class extends Shape {
    static displayName = 'Span';

    static propTypes = {
        ...pathProps,
        ...fontProps,
        href: PropTypes.string.isRequired,
        startOffset: numberProp
    };

    render() {
        let {children, href, startOffset, ...props} = this.props;
        if (href) {
            let matched = href.match(idExpReg);

            if (matched) {
                href = matched[1];

                return <RNSVGTextPath
                    href={href}
                    {...extractProps({
                        ...props,
                        x: null,
                        y: null
                    }, this)}
                    {...extractText({
                        children,
                        startOffset
                    }, true)}
                />;
            }
        }

        console.warn('Invalid `href` prop for `TextPath` element, expected a href like `"#id"`, but got: "' + props.href + '"');
        return <TSpan>{children}</TSpan>
    }

}

const RNSVGTextPath = createReactNativeComponentClass({
    validAttributes: TextPathAttributes,
    uiViewClassName: 'RNSVGTextPath'
});

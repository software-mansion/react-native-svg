import React, {PropTypes} from 'react';
import createReactNativeComponentClass from 'react/lib/createReactNativeComponentClass';
import {UseAttributes} from '../lib/attributes';
import Shape from './Shape';
import {pathProps, fontProps} from '../lib/props';

const idExpReg = /^#(.+)$/;
class TextPath extends Shape {
    static displayName = 'Span';

    static propTypes = {
        ...pathProps,
        ...fontProps,
        href: PropTypes.string.isRequired,
        textAnchor: PropTypes.oneOf(['start', 'middle', 'end'])
    };

    render() {
        let {props} = this;
        let matched = props.href.match(idExpReg);
        let href;

        if (matched) {
            href = matched[1];
        }

        if (!href) {
            console.warn('Invalid `href` prop for `TextPath` element, expected a href like `"#id"`, but got: "' + props.href + '"');
        }

        return <RNSVGTextPath
            href={href}
            {...this.extractProps({
                ...props,
                x: null,
                y: null
            })}
            {...extractText({
                ...props,
                dx: null,
                dy: null
            })}
        />;
    }
}

const RNSVGTextPath = createReactNativeComponentClass({
    validAttributes: UseAttributes,
    uiViewClassName: 'RNSVGTextPath'
});

export default TextPath;

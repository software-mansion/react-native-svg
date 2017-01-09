import React, {PropTypes} from 'react';
import createReactNativeComponentClass from 'react-native/Libraries/Renderer/src/renderers/native/createReactNativeComponentClass';
import {TextPathAttributes} from '../lib/attributes';
import extractText from '../lib/extract/extractText';
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
            {...extractText({children: props.children})}
        />;
    }
}

const RNSVGTextPath = createReactNativeComponentClass({
    validAttributes: TextPathAttributes,
    uiViewClassName: 'RNSVGTextPath'
});

export default TextPath;

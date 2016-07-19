import {PropTypes} from 'react';
import {pathProps} from '../lib/props';
import {UseAttributes} from '../lib/attributes';
import Shape from './Shape';
import React from 'react';
import patternReg from '../lib/extract/patternReg';
import createReactNativeComponentClass from 'react/lib/createReactNativeComponentClass';

class Defs extends Shape {
    static displayName = 'Use';

    static propTypes = {
        href: PropTypes.string.isRequired,
        ...pathProps
    };

    setNativeProps = (...args) => {
        this.root.setNativeProps(...args);
    };

    render() {
        let {props} = this;
        // 尝试匹配 "url(#pattern)"
        let matched = props.href.match(patternReg);
        let href;

        if (matched) {
            href = matched[1];
        }

        if (!href) {
            console.warn('Invalid `href` prop for `Use` element, expected a href like `"url(#id)"`, but got: "' + props.href + '"');
        }

        return <RNSVGUse
            ref={ele => this.root = ele}
            {...this.extractProps(props, {
                stroke: true,
                fill: true,
                responder: true,
                transform: true
            })}
            href={href}
        >{props.children}</RNSVGUse>;
    }
}

const RNSVGUse = createReactNativeComponentClass({
    validAttributes: UseAttributes,
    uiViewClassName: 'RNSVGUse'
});

export default Defs;


import React from 'react';
import PropTypes from 'prop-types';
import createReactNativeComponentClass from 'react-native/Libraries/Renderer/shims/createReactNativeComponentClass';
import extractProps from '../lib/extract/extractProps';
import {pathProps, numberProp} from '../lib/props';
import {UseAttributes} from '../lib/attributes';
import Shape from './Shape';

const idExpReg = /^#(.+)$/;
export default class extends Shape {
    static displayName = 'Use';

    static propTypes = {
        href: PropTypes.string.isRequired,
        width: numberProp, // Just for reusing `Symbol`
        height: numberProp, //  Just for reusing `Symbol`
        ...pathProps
    };

    setNativeProps = (...args) => {
        this.root.setNativeProps(...args);
    };

    render() {
        const {props} = this;
        // match "url(#pattern)"
        const matched = props.href.match(idExpReg);
        let href;

        if (matched) {
            href = matched[1];
        }

        if (!href) {
            console.warn('Invalid `href` prop for `Use` element, expected a href like `"#id"`, but got: "' + props.href + '"');
        }

        return <RNSVGUse
            ref={ele => {this.root = ele;}}
            {...extractProps(props, this)}
            href={href}
            width={props.width}
            height={props.height}
        >{props.children}</RNSVGUse>;
    }
}

const RNSVGUse = createReactNativeComponentClass({
    validAttributes: UseAttributes,
    uiViewClassName: 'RNSVGUse'
});


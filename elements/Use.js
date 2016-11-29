import {PropTypes} from 'react';
import {pathProps, numberProp} from '../lib/props';
import {UseAttributes} from '../lib/attributes';
import Shape from './Shape';
import React from 'react';
import createReactNativeComponentClass from 'react-native/Libraries/Renderer/src/renderers/native/createReactNativeComponentClass';

const idExpReg = /^#(.+)$/;
class Use extends Shape {
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
        let {props} = this;
        // 尝试匹配 "url(#pattern)"
        let matched = props.href.match(idExpReg);
        let href;

        if (matched) {
            href = matched[1];
        }

        if (!href) {
            console.warn('Invalid `href` prop for `Use` element, expected a href like `"#id"`, but got: "' + props.href + '"');
        }

        let extractedProps = this.extractProps(props);

        return <RNSVGUse
            ref={ele => {this.root = ele;}}
            {...extractedProps}
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

export default Use;


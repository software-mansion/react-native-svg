import {PropTypes} from 'react';
import {pathProps} from '../lib/props';
import {UseAttributes, RenderableOnlyAttributes} from '../lib/attributes';
import Shape from './Shape';
import React from 'react';
import patternReg from '../lib/extract/patternReg';
import createReactNativeComponentClass from 'react/lib/createReactNativeComponentClass';
import _ from 'lodash';

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

        let mergeList = [];

        let extractedProps = this.extractProps(props, {
            stroke: true,
            fill: true,
            responder: true,
            transform: true
        });

        Object.keys(RenderableOnlyAttributes).forEach(name => {

            if (!_.isNil(props[name])) {
                // clipPath prop may provide `clipPathRef` as native prop
                if (name === 'clipPath') {
                    if (extractedProps[name]) {
                        mergeList.push(name);
                    } else if (extractedProps.clipPathRef) {
                        mergeList.push('clipPathRef');
                    }
                } else {
                    mergeList.push(name);
                }
            }
        });

        return <RNSVGUse
            ref={ele => this.root = ele}
            {...extractedProps}
            mergeList={mergeList}
            href={href}
        >{props.children}</RNSVGUse>;
    }
}

const RNSVGUse = createReactNativeComponentClass({
    validAttributes: UseAttributes,
    uiViewClassName: 'RNSVGUse'
});

export default Defs;


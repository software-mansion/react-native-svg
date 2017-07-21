import React from 'react';
import createReactNativeComponentClass from 'react-native/Libraries/Renderer/shims/createReactNativeComponentClass.js';
import Shape from './Shape';
import {pathProps, numberProp} from '../lib/props';
import {EllipseAttributes} from '../lib/attributes';
import extractProps from '../lib/extract/extractProps';

export default class extends Shape{
    static displayName = 'Ellipse';

    static propTypes = {
        ...pathProps,
        cx: numberProp.isRequired,
        cy: numberProp.isRequired,
        rx: numberProp.isRequired,
        ry: numberProp.isRequired
    };

    static defaultProps = {
        cx: 0,
        cy: 0,
        rx: 0,
        ry: 0
    };

    setNativeProps = (...args) => {
        this.root.setNativeProps(...args);
    };

    render() {
        let props = this.props;

        return <RNSVGEllipse
            ref={ele => {this.root = ele;}}
            {...extractProps(props, this)}
            cx={props.cx.toString()}
            cy={props.cy.toString()}
            rx={props.rx.toString()}
            ry={props.ry.toString()}
        />;
    }
}

const RNSVGEllipse = createReactNativeComponentClass({
    validAttributes: EllipseAttributes,
    uiViewClassName: 'RNSVGEllipse'
});

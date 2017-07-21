import React from 'react';
import './Path'; // must import Path first, don`t know why. without this will throw an `Super expression must either be null or a function, not undefined`
import createReactNativeComponentClass from 'react-native/Libraries/Renderer/shims/createReactNativeComponentClass.js';
import {pathProps, numberProp} from '../lib/props';
import {RectAttributes} from '../lib/attributes';
import extractProps from '../lib/extract/extractProps';
import Shape from './Shape';

export default class extends Shape {
    static displayName = 'Rect';

    static propTypes = {
        ...pathProps,
        x: numberProp.isRequired,
        y: numberProp.isRequired,
        width: numberProp.isRequired,
        height: numberProp.isRequired,
        rx: numberProp,
        ry: numberProp
    };

    static defaultProps = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        rx: 0,
        ry: 0
    };

    setNativeProps = (...args) => {
        this.root.setNativeProps(...args);
    };

    render() {
        let props = this.props;

        return <RNSVGRect
            ref={ele => {this.root = ele;}}
            {...extractProps({
                ...props,
                x: null,
                y: null
            }, this)}
            x={props.x.toString()}
            y={props.y.toString()}
            width={props.width.toString()}
            height={props.height.toString()}
            rx={props.rx.toString()}
            ry={props.ry.toString()}
        />;
    }
}

const RNSVGRect = createReactNativeComponentClass({
    validAttributes: RectAttributes,
    uiViewClassName: 'RNSVGRect'
});

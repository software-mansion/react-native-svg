import React, {PropTypes} from 'react';
import createReactNativeComponentClass from 'react/lib/createReactNativeComponentClass';
import {LineAttributes} from '../lib/attributes';
import mergeContext from '../lib/mergeContext';
import Shape from './Shape';
import {lineProps, pathProps, fillProps, strokeProps, numberProp} from '../lib/props';

class Line extends Shape {
    static displayName = 'Line';

    static propTypes = {
        ...pathProps,
        ...lineProps
    };

    static defaultProps = {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0
    };

    setNativeProps = (...args) => {
        this.root.setNativeProps(...args);
    };

    render() {
        let props = mergeContext(this.props, this.context);
        return <RNSVGLine
            ref={ele => this.root = ele}
            {...this.extractProps(props)}
            x1={props.x1.toString()}
            y1={props.y1.toString()}
            x2={props.x2.toString()}
            y2={props.y2.toString()}
        />;
    }
}

const RNSVGLine = createReactNativeComponentClass({
    validAttributes: LineAttributes,
    uiViewClassName: 'RNSVGLine'
});

export default Line;

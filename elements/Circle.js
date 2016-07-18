import React, {PropTypes} from 'react';
import createReactNativeComponentClass from 'react/lib/createReactNativeComponentClass';
import Shape from './Shape';
import mergeContext from '../lib/mergeContext';
import {CircleAttributes} from '../lib/attributes';
import {circleProps, pathProps, fillProps, strokeProps, numberProp} from '../lib/props';

class Circle extends Shape {
    static displayName = 'Circle';
    static propTypes = {
        ...pathProps,
        ...circleProps
    };

    static contextTypes = {
        ...fillProps,
        ...strokeProps,
        ...circleProps,
        isInGroup: PropTypes.bool,
        svgId: numberProp
    };

    render() {
        let props = mergeContext(this.props, this.context);
        return <RNSVGCircle
            {...this.extractProps(props)}
            cx={props.cx.toString()}
            cy={props.cy.toString()}
            r={props.r.toString()}
        />;
    }
}



const RNSVGCircle = createReactNativeComponentClass({
    validAttributes: CircleAttributes,
    uiViewClassName: 'RNSVGCircle'
});

export default Circle;

import React, {PropTypes, Component} from 'react';
import extractProps from '../lib/extract/extractProps';
import createNativeComponent from '../lib/createNativeComponent';
import mergeContext from '../lib/mergeContext';
import {circleProps, pathProps, fillProps, strokeProps, numberProp} from '../lib/props';

    static displayName = 'Circle';
    static propTypes = {
        ...pathProps,
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
            cx={props.cx.toString()}
            cy={props.cy.toString()}
            r={props.r.toString()}
        />;
    }
}

const RNSVGCircle = createNativeComponent('RNSVGCircle');

export default Circle;

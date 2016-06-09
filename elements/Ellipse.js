import React, {PropTypes} from 'react';
import createNativeComponent from '../lib/createNativeComponent';
import mergeContext from '../lib/mergeContext';
import Shape from './Shape';
import {ellipseProps, pathProps, fillProps, strokeProps, numberProp} from '../lib/props';


class Ellipse extends Shape{
    static displayName = 'Ellipse';
    static propTypes = {
        ...pathProps,
        ...ellipseProps
    };

    static contextTypes = {
        ...fillProps,
        ...strokeProps,
        ...ellipseProps,
        isInGroup: PropTypes.bool,
        svgId: numberProp
    };

    render() {
        let props = mergeContext(this.props, this.context);
        return <RNSVGEllipse
            {...this.extractProps(props)}
            cx={props.cx.toString()}
            cy={props.cy.toString()}
            rx={props.rx.toString()}
            ry={props.ry.toString()}
        />;
    }
}

const RNSVGEllipse = createNativeComponent('RNSVGEllipse');

export default Ellipse;

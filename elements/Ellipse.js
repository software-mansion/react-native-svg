import React, {PropTypes} from 'react';
import createReactNativeComponentClass from 'react/lib/createReactNativeComponentClass';
import mergeContext from '../lib/mergeContext';
import Shape from './Shape';
import {ellipseProps, pathProps, fillProps, strokeProps, numberProp} from '../lib/props';
import {EllipseAttributes} from '../lib/attributes';

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

    setNativeProps = (...args) => {
        this.root.setNativeProps(...args);
    };

    render() {
        let props = mergeContext(this.props, this.context);
        return <RNSVGEllipse
            ref={ele => this.root = ele}
            {...this.extractProps(props)}
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

export default Ellipse;

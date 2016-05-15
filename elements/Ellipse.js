import React, {PropTypes, Component} from 'react';
import extractProps from '../lib/extract/extractProps';
import createNativeComponent from '../lib/createNativeComponent';
import mergeContext from '../lib/mergeContext';
import {ellipseProps, pathProps, fillProps, strokeProps, numberProp} from '../lib/props';


class Ellipse extends Component{
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
        console.log(props);
        return <RNSVGEllipse
            {...extractProps(props)}
            cx={props.cx.toString()}
            cy={props.cy.toString()}
            rx={props.rx.toString()}
            ry={props.ry.toString()}
        />;
    }
}

const RNSVGEllipse = createNativeComponent('RNSVGEllipse');

export default Ellipse;

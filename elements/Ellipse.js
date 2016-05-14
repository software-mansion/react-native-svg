import React, {PropTypes, Component} from 'react';
import extractProps from '../lib/extract/extractProps';
import {RenderableAttributes} from '../lib/attributes';
import {requireNativeComponent} from 'react-native';
import mergeContext from '../lib/mergeContext';
import {ellipseProps, pathProps, fillProps, strokeProps} from '../lib/props';


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
        isInGroup: PropTypes.bool
    };

    render() {
        let props = mergeContext(this.props, this.context);
        return <RNSVGEllipse
            {...extractProps(props)}
            cx={props.cx.toString()}
            cy={props.cy.toString()}
            rx={props.rx.toString()}
            ry={props.ry.toString()}
        />;
    }
}

const RNSVGEllipse = requireNativeComponent('RNSVGEllipse', null);
export default Ellipse;

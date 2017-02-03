import React, {PropTypes, Component} from 'react';
import {numberProp} from '../lib/props';
import extractGradient from '../lib/extract/extractGradient';
import createReactNativeComponentClass from 'react-native/Libraries/Renderer/src/renderers/native/createReactNativeComponentClass';
import {RadialGradientAttributes} from '../lib/attributes';

export default class extends Component{
    static displayName = 'RadialGradient';
    static propTypes = {
        fx: numberProp.isRequired,
        fy: numberProp.isRequired,
        rx: numberProp,
        ry: numberProp,
        cx: numberProp.isRequired,
        cy: numberProp.isRequired,
        r: numberProp,
        id: PropTypes.string.isRequired
    };

    static defaultProps = {
        fx: '50%',
        fy: '50%',
        cx: '50%',
        cy: '50%',
        r: '50%'
    };

    render() {
        let {props} = this;
        return <RNSVGRadialGradient
            fx={props.fx.toString()}
            fy={props.fy.toString()}
            rx={(props.rx || props.r).toString()}
            ry={(props.ry || props.r).toString()}
            cx={props.cx.toString()}
            cy={props.cy.toString()}
            {...extractGradient(this.props)}
        />;

    }
}

const RNSVGRadialGradient = createReactNativeComponentClass({
    validAttributes: RadialGradientAttributes,
    uiViewClassName: 'RNSVGRadialGradient'
});

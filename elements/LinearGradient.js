import React, {PropTypes} from 'react';
import {numberProp} from '../lib/props';
import Gradient from './Gradient';
import createReactNativeComponentClass from 'react-native/Libraries/Renderer/src/renderers/native/createReactNativeComponentClass';
import {LinearGradientAttributes} from '../lib/attributes';

class LinearGradient extends Gradient{
    static displayName = 'LinearGradient';
    static propTypes = {
        x1: numberProp.isRequired,
        x2: numberProp.isRequired,
        y1: numberProp.isRequired,
        y2: numberProp.isRequired,
        id: PropTypes.string.isRequired
    };

    static defaultProps = {
        x1: '0%',
        y1: '0%',
        x2: '100%',
        y2: '0%'
    };

    render() {
        let {props} = this;
        return <RNSVGLinearGradient
            x1={props.x1.toString()}
            y1={props.y1.toString()}
            x2={props.x2.toString()}
            y2={props.y2.toString()}
            gradient={this.getGradient()}
            name={props.id}
        />;

    }
}

const RNSVGLinearGradient = createReactNativeComponentClass({
    validAttributes: LinearGradientAttributes,
    uiViewClassName: 'RNSVGLinearGradient'
});


export default LinearGradient;

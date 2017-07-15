import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {numberProp} from '../lib/props';
import extractGradient from '../lib/extract/extractGradient';
import createReactNativeComponentClass from 'react-native/Libraries/Renderer/shims/createReactNativeComponentClass';
import {LinearGradientAttributes} from '../lib/attributes';

export default class extends Component{
    static displayName = 'LinearGradient';
    static propTypes = {
        x1: numberProp.isRequired,
        x2: numberProp.isRequired,
        y1: numberProp.isRequired,
        y2: numberProp.isRequired,
        gradientUnits: PropTypes.oneOf(['objectBoundingBox', 'userSpaceOnUse']),
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
            {...extractGradient(this.props)}
        />;

    }
}

const RNSVGLinearGradient = createReactNativeComponentClass({
    validAttributes: LinearGradientAttributes,
    uiViewClassName: 'RNSVGLinearGradient'
});

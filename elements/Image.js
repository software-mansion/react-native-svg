import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-native';
import createReactNativeComponentClass from '../lib/createReactNativeComponentClass';
import {ImageAttributes} from '../lib/attributes';
import {numberProp, touchableProps, responderProps} from '../lib/props';
import Shape from './Shape';
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';
import {meetOrSliceTypes, alignEnum} from '../lib/extract/extractViewBox';
import extractProps from '../lib/extract/extractProps';

const spacesRegExp = /\s+/;

export default class extends Shape {
    static displayName = 'Image';
    static propTypes = {
        ...responderProps,
        ...touchableProps,
        x: numberProp,
        y: numberProp,
        width: numberProp.isRequired,
        height: numberProp.isRequired,
        href: Image.propTypes.source,
        preserveAspectRatio: PropTypes.string
    };

    static defaultProps = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        preserveAspectRatio: 'xMidYMid meet'
    };

    setNativeProps = (...args) => {
        this.root.setNativeProps(...args);
    };

    render() {
        let {props} = this;
        let modes = props.preserveAspectRatio.trim().split(spacesRegExp);
        let meetOrSlice = meetOrSliceTypes[modes[1]] || 0;
        let align = alignEnum[modes[0]] || 'xMidYMid';

        return <RNSVGImage
            ref={ele => {this.root = ele;}}
            {...extractProps({...props, x: null, y: null}, this)}
            x={props.x.toString()}
            y={props.y.toString()}
            width={props.width.toString()}
            height={props.height.toString()}
            meetOrSlice={meetOrSlice}
            align={align}
            src={resolveAssetSource(props.href)}
        />;
    }
}

const RNSVGImage = createReactNativeComponentClass('RNSVGImage', () => ({
    validAttributes: ImageAttributes,
    uiViewClassName: 'RNSVGImage'
}));

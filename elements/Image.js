import React, {PropTypes} from 'react';
import createReactNativeComponentClass from 'react/lib/createReactNativeComponentClass';
import {ImageAttributes} from '../lib/attributes';
import {numberProp, touchableProps, responderProps} from '../lib/props';
import Shape from './Shape';
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';


class Image extends Shape {
    static displayName = 'Image';
    static propTypes = {
        x: numberProp,
        y: numberProp,
        width: numberProp,
        height: numberProp,
        href: PropTypes.number.isRequired,
        ...responderProps,
        ...touchableProps
        //preserveAspectRatio: PropTypes.string
    };


    render() {
        let {props} = this;
        return <RNSVGImage
            {...this.extractProps(props, {transform: true, responder: true})}
            x={props.x.toString()}
            y={props.y.toString()}
            width={props.width.toString()}
            height={props.height.toString()}
            src={resolveAssetSource(props.href)}
        />;
    }
}

const RNSVGImage = createReactNativeComponentClass({
    validAttributes: ImageAttributes,
    uiViewClassName: 'RNSVGImage'
});

export default Image;

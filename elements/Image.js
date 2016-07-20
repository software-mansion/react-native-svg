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
        width: numberProp.isRequired,
        height: numberProp.isRequired,
        href: PropTypes.number.isRequired,
        ...responderProps,
        ...touchableProps
        //preserveAspectRatio: PropTypes.string
    };

    static defaultProps = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    };

    setNativeProps = (...args) => {
        this.root.setNativeProps(...args);
    };

    render() {
        let {props} = this;
        return <RNSVGImage
            ref={ele => this.root = ele}
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

import React, {
    Component,
    PropTypes
} from 'react-native';
import extractProps from '../lib/extract/extractProps';
import {ImageAttributes} from '../lib/attributes';
import {numberProp} from '../lib/props';
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';
import createReactNativeComponentClass from 'react-native/Libraries/ReactNative/createReactNativeComponentClass';
import formatPercentageProps from '../lib/formatPercentageProps';

class Image extends Component{
    static displayName = 'Image';
    static propTypes = {
        x: numberProp,
        y: numberProp,
        width: numberProp,
        height: numberProp,
        href: PropTypes.number.isRequired
        //preserveAspectRatio: PropTypes.string
    };


    render() {
        return <RNSVGImage
            {...extractProps(this.props, {transform: true})}
            layout={formatPercentageProps(this.props, ['x', 'y', 'width', 'height'])}
            src={resolveAssetSource(this.props.href)}
        />;
    }
}

let RNSVGImage = createReactNativeComponentClass({
    validAttributes: ImageAttributes,
    uiViewClassName: 'RNSVGImage'
});


export default Image;

import React, {
    Component,
    PropTypes
} from 'react';
import {
    View,
    requireNativeComponent,
    StyleSheet,
    UIManager,
    findNodeHandle,
    NativeModules,
    Platform
} from 'react-native';
import extractViewBox from '../lib/extract/extractViewBox';
import {ViewBoxAttributes} from '../lib/attributes';
import _ from 'lodash';

const RNSVGSvgViewManager = NativeModules.RNSVGSvgViewManager;

// Svg - Root node of all Svg elements
let id = 0;

const styles = StyleSheet.create({
    svg: {
        backgroundColor: 'transparent'
    }
});

class Svg extends Component{
    static displayName = 'Svg';
    static propTypes = {
        ...View.propTypes,
        opacity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        // more detail https://svgwg.org/svg2-draft/coords.html#ViewBoxAttribute
        viewBox: PropTypes.string,
        preserveAspectRatio: PropTypes.string
    };

    static defaultProps = {
        preserveAspectRatio: 'xMidYMid meet'
    };

    constructor() {
        super(...arguments);
        id++;
        this.id = id;
        this.onDataURLCallbacks = [];
    }
    measureInWindow = (...args) => {
        this.root.measureInWindow(...args);
    };

    measure = (...args) => {
        this.root.measure(...args);
    };

    measureLayout = (...args) => {
        this.root.measureLayout(...args);
    };

    setNativeProps = (...args) => {
        this.root.setNativeProps(...args);
    };


    toDataURL = Platform.OS === 'ios' ? (callback = _.noop) => {
        RNSVGSvgViewManager.toDataURL(findNodeHandle(this.root), callback);
    } : (callback = _.noop) => {
        let node = findNodeHandle(this.root);
        this.onDataURLCallbacks.push(callback);
        UIManager.dispatchViewManagerCommand(
            node,
            UIManager.RNSVGSvgView.Commands.toDataURL,
            null
        );
    };

    _onDataURL = (e) => {
        while (this.onDataURLCallbacks.length) {
            let callback = this.onDataURLCallbacks.shift();
            callback(e.nativeEvent.base64);
        }
    };

    render() {
        const {opacity, width, height, viewBox, preserveAspectRatio, style, ...props} = this.props;
        let dimensions;

        if (width && height) {
            dimensions = {
                width: +width,
                height: +height,
                flex: 0
            };
        }

        return <NativeSvgView
            {...props}
            {...extractViewBox({ viewBox, preserveAspectRatio })}
            ref={ele => {this.root = ele;}}
            style={[
                styles.svg,
                style,
                !isNaN(+opacity) && {
                    opacity: +opacity
                },
                dimensions
            ]}
            onDataURL={this._onDataURL}
        />;
    }
}

const NativeSvgView = requireNativeComponent('RNSVGSvgView', null, {
    nativeOnly: {
        ...ViewBoxAttributes
    }
});


export default Svg;

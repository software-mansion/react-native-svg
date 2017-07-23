//noinspection JSUnresolvedVariable
import React, {
    Component
} from 'react';
import PropTypes from 'prop-types';
import {
    ViewPropTypes,
    requireNativeComponent,
    StyleSheet,
    findNodeHandle,
    NativeModules
} from 'react-native';
import extractViewBox from '../lib/extract/extractViewBox';
import {ViewBoxAttributes} from '../lib/attributes';

/** @namespace NativeModules.RNSVGSvgViewManager */
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
        ...ViewPropTypes,
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
        //noinspection JSUnusedGlobalSymbols
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

    toDataURL = (callback) => {
        callback && RNSVGSvgViewManager.toDataURL(findNodeHandle(this.root), callback);
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
        />;
    }
}

const NativeSvgView = requireNativeComponent('RNSVGSvgView', null, {
    nativeOnly: {
        ...ViewBoxAttributes
    }
});

export default Svg;

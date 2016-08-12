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
import ViewBox from './ViewBox';
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
        let {props} = this;
        let opacity = +props.opacity;
        let width = +props.width;
        let height = +props.height;
        let viewBox = props.viewBox;
        let dimensions;

        if (width && height) {
            dimensions = {
                width,
                height,
                flex: 0
            };
        }

        if (props.viewbox) {
            viewBox = props.viewbox;
            console.warn('Prop `viewbox` is deprecated. please use `viewBox` instead.');
        }

        let content = viewBox ? <ViewBox
            viewBox={viewBox}
            preserveAspectRatio={props.preserveAspectRatio}
        >{props.children}</ViewBox> : props.children;

        const nativeProps = _.omit(props, ['width', 'height', 'viewBox', 'preserveAspectRatio', 'opacity']);

        return <NativeSvgView
            {...nativeProps}
            ref={ele => {this.root = ele;}}
            style={[
                styles.svg,
                props.style,
                !isNaN(opacity) && {
                    opacity
                },
                dimensions
            ]}
            onDataURL={this._onDataURL}
        >
            {content}
        </NativeSvgView>;
    }
}

const NativeSvgView = requireNativeComponent('RNSVGSvgView', null);


export default Svg;

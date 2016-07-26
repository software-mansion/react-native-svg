import React, {Children, Component, cloneElement, PropTypes} from 'react';
import {View, requireNativeComponent, StyleSheet} from 'react-native';
import ViewBox from './ViewBox';

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
            }
        }

        if (props.viewbox) {
            viewBox = props.viewbox;
            console.warn('Prop `viewbox` is deprecated. please use `viewBox` instead.');
        }

        let content = viewBox ? <ViewBox
            viewBox={viewBox}
            preserveAspectRatio={props.preserveAspectRatio}
        >{props.children}</ViewBox> : props.children;

        return (
            <NativeSvgView
                {...props}
                opacity={null}
                width={null}
                height={null}
                viewBox={null}
                preserveAspectRatio={null}
                ref={ele => this.root = ele}
                style={[
                    styles.svg,
                    props.style,
                    !isNaN(opacity) && {
                        opacity
                    },
                    dimensions
                ]}
            >
                {content}
            </NativeSvgView>
        );
    }
}

const NativeSvgView = requireNativeComponent('RNSVGSvgView', null);

export default Svg;

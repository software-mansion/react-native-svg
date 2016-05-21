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
        viewbox: PropTypes.string,
        // TODO: complete other values of preserveAspectRatio
        // http://www.justinmccandless.com/demos/viewbox/index.html
        // http://tutorials.jenkov.com/svg/svg-viewport-view-box.html
        preserveAspectRatio: PropTypes.string // preserveAspectRatio only supports 'none' for now
    };

    constructor() {
        super(...arguments);
        id++;
        this.id = id;
    }

    getChildren = () => {
        return Children.map(this.props.children, child => {
            return cloneElement(child, {
                svgId: this.id
            });
        });
    };

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
        let flexLayout = isNaN(width) || isNaN(height);

        let content = (props.viewbox && !flexLayout) ? <ViewBox
            viewbox={props.viewbox}
            preserveAspectRatio={props.preserveAspectRatio}
            width={props.width}
            height={props.height}
        >
            {this.getChildren()}
        </ViewBox> : this.getChildren();

        return (
            <NativeSvgView
                {...props}
                opacity={null}
                width={null}
                height={null}
                viewbox={null}
                preserveAspectRatio={null}
                ref={ele => this.root = ele}
                style={[
                    styles.svg,
                    props.style,
                    !isNaN(opacity) && {
                        opacity
                    },
                    !flexLayout && {
                        width,
                        height,
                        flex: 0
                    }
                ]}
            >
                {content}
            </NativeSvgView>
        );
    }
}

const NativeSvgView = requireNativeComponent('RNSVGSvgView', null);

export default Svg;

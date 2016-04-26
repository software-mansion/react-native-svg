import React, {
    Component,
    PropTypes,
    Children,
    cloneElement,
    View,
    requireNativeComponent
} from 'react-native';
import ViewBox from './ViewBox';
import _ from 'lodash';


// Svg - Root node of all Svg elements
let id = 0;

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
        this.refs.root.measureInWindow(...args);
    };

    measure = (...args) => {
        this.refs.root.measure(...args);
    };

    measureLayout = (...args) => {
        this.refs.root.measureLayout(...args);
    };

    setNativeProps = (...args) => {
        this.refs.root.setNativeProps(...args);
    };

    render() {
        let {props} = this;
        let opacity = +props.opacity;
        let content = props.viewbox ? <ViewBox
            viewbox={props.viewbox}
            preserveAspectRatio={props.preserveAspectRatio}
            width={props.width}
            height={props.height}
        >
            {this.getChildren()}
        </ViewBox> : this.getChildren();

        let width = +props.width || 0;
        let height = +props.height || 0;

        return (
            <NativeSvgView
                ref="root"
                style={[
                    props.style,
                    !isNaN(opacity) && {
                        opacity
                    },
                    {width, height}
                ]}
            >
                {content}
            </NativeSvgView>
        );
    }
}

const NativeSvgView = requireNativeComponent('RNSVGSvgView', Svg);

export default Svg;

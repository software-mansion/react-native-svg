import React, {
    Component,
    PropTypes,
    Children,
    cloneElement,
    ART
} from 'react-native';
import extractViewbox from '../lib/extractViewbox';
import ViewBox from './ViewBox';
import _ from 'lodash';

let {
    Surface
} = ART;

let id = 0;

class Svg extends Component{
    static displayName = 'Svg';
    static propType = {
        opacity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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

        return <Surface
            {...props}
            ref="svg"
            style={[
                props.style,
                !isNaN(opacity) && {
                    opacity: opacity
                }
            ]}
        >
            {content}
        </Surface>;
    }
}

export default Svg;

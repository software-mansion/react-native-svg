import React, {
    Component,
    PropTypes,
    ART
} from 'react-native';

let {
    Shape,
} = ART;

import G from './G';
import extractViewbox from '../lib/extractViewbox';
class ViewBox extends Component{
    static displayName = 'ViewBox';
    static propType = {
        transform: PropTypes.bool
    };
    static defaultProps = {
        transform: false
    };

    render() {
        let viewbox = extractViewbox(this.props);
        let scaleX = 1;
        let scaleY = 1;
        let x = 0;
        let y = 0;
        if (viewbox) {
            scaleX = viewbox.scaleX;
            scaleY = viewbox.scaleY;
            x = viewbox.x;
            y = viewbox.y;
        }
        return <G
            x={x}
            y={y}
            scaleX={scaleX}
            scaleY={scaleY}
            id={this.props.id}
            svgId={this.props.svgId}
        >
            {(!scaleX || !scaleY) ? null : this.props.children}
        </G>
    }
}

export default ViewBox;

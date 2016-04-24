import React, {
    Component,
    PropTypes
} from 'react-native';
import Path from './Path';

let propType = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

class Line extends Component{
    static displayName = 'Line';
    static propTypes = {
        x1: propType,
        x2: propType,
        y1: propType,
        y2: propType,
        strokeLinecap: PropTypes.oneOf(['butt', 'square', 'round'])
    };

    static getPath = (props) => (
        `M${props.x1},${props.y1} L${props.x2},${props.y2}`
    );

    render() {
        return <Path
            {...this.props}
            d={Line.getPath(this.props)}
        />;
    }
}

export default Line;

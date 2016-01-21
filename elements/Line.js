import React, {
    Component,
    PropTypes,
    ART
} from 'react-native';

let {
    Shape,
} = ART;

import strokeFilter from '../lib/strokeFilter';
let propType = PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired;
class Line extends Component{
    static displayName = 'Line';
    static propTypes = {
        x1: propType,
        x2: propType,
        y1: propType,
        y2: propType,
        strokeLinecap: PropTypes.oneOf(['butt', 'square', 'round']),
        strokeCap: PropTypes.oneOf(['butt', 'square', 'round'])
    };
    render() {
        let {props} = this;
        let d = `M${props.x1},${props.y1}L${props.x2},${props.y2}Z`;

        return <Shape
            {...props}
            x1={null}
            y1={null}
            x2={null}
            y2={null}
            fill={null}
            stroke={strokeFilter(props)}
            strokeCap={props.strokeLinecap || props.strokeCap || 'square'}
            d={d}
        />;
    }
}

export default Line;

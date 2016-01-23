import React, {
    ART,
    Component,
    PropTypes
} from 'react-native';

let {
    Shape
} = ART;

import fillFilter from '../lib/fillFilter';
import strokeFilter from '../lib/strokeFilter';
let propType = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);
class Path extends Component{
    static displayName = 'Path';
    static propTypes = {
        d: PropTypes.string,
        x: propType,
        y: propType,
        strokeLinecap: PropTypes.oneOf(['butt', 'square', 'round']),
        strokeCap: PropTypes.oneOf(['butt', 'square', 'round']),
        strokeLinejoin: PropTypes.oneOf(['miter', 'bevel', 'round']),
        strokeJoin: PropTypes.oneOf(['miter', 'bevel', 'round']),
        strokeDasharray: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.number)])
    };
    render() {
        let {props} = this;

        return <Shape
            {...props}
            {...strokeFilter(props)}
            fill={fillFilter(props)}
        />;
    }
}

export default Path;

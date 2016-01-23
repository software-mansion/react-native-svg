import React, {
    ART,
    Component,
    PropTypes,
    cloneElement
} from 'react-native';

let {
    Shape
} = ART;
import Defs from './Defs';

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
        let element = <Shape
            {...props}
            {...strokeFilter(props)}
            fill={fillFilter(props)}
            id={null}
        />;
        if (this.props.id) {
            Defs.set(this.props.id + ':' + this.props.svgId, <Path {...this.props} id={null} />);
        }
        return element;
    }
}

export default Path;

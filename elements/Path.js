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
import transformFilter from '../lib/transformFilter';
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
        if (props.id) {
            return <Defs.Item
                id={props.id}
                svgId={props.svgId}
                visible={true}
            >
                <Path {...props} id={null} />
            </Defs.Item>;
        }
        return <Shape
            {...props}
            {...strokeFilter(props)}
            {...transformFilter(props)}
            fill={fillFilter(props)}
            id={null}
        />;
    }
}

export default Path;

import {Component, PropTypes} from 'react';

let propType = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

class Pattern extends Component{
    static displayName = 'Pattern';
    static propTypes = {
        x1: propType,
        x2: propType,
        y1: propType,
        y2: propType,
        patternTransform: PropTypes.string,
        patternUnits: PropTypes.oneOf(['userSpaceOnUse', 'objectBoundingBox']),
        patternContentUnits: PropTypes.oneOf(['userSpaceOnUse', 'objectBoundingBox'])
    };


    render() {
        return null;
    }
}

export default Pattern;

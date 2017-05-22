import {Component} from 'react';
import PropTypes from 'prop-types';
import {numberProp} from '../lib/props';

export default class extends Component{
    static displayName = 'Pattern';
    static propTypes = {
        x1: numberProp,
        x2: numberProp,
        y1: numberProp,
        y2: numberProp,
        patternTransform: PropTypes.string,
        patternUnits: PropTypes.oneOf(['userSpaceOnUse', 'objectBoundingBox']),
        patternContentUnits: PropTypes.oneOf(['userSpaceOnUse', 'objectBoundingBox'])
    };


    render() {
        return null;
    }
}

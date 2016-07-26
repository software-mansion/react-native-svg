import {Component, PropTypes} from 'react';
import {numberProp} from '../lib/props';

class Stop extends Component{
    static displayName = 'Stop';
    static propTypes = {
        stopColor: PropTypes.string,
        stopOpacity: numberProp
    };

    static defaultProps = {
        stopColor: '#000',
        stopOpacity: 1
    };

    render() {
        return null;
    }
}

export default Stop;


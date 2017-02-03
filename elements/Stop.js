import {Component, PropTypes} from 'react';
import {numberProp} from '../lib/props';

export default class extends Component{
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

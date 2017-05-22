import {Component} from 'react';
import PropTypes from 'prop-types';
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

import React, {
    Component,
    PropTypes
} from 'react-native';
import Path from './Path';
import {pathProps} from '../lib/props';

class Polyline extends Component{
    static displayName = 'Polyline';
    static propTypes = {
        ...pathProps,
        points: PropTypes.string
    };

    render() {
        return <Path
            {...this.props}
            d={`M${this.props.points.trim().replace(/\s+/g, 'L')}`}
        />;
    }
}
export default Polyline;

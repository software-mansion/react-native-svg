import React, {Component, PropTypes} from 'react';
import Path from './Path';
import {pathProps} from '../lib/props';

class Polyline extends Component{
    static displayName = 'Polyline';
    static propTypes = {
        ...pathProps,
        points: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
    };

    render() {
        return <Path
            {...this.props}
            d={`M${this.props.points.trim().replace(/\s+/g, 'L')}`}
        />;
    }
}
export default Polyline;

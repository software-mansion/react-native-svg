import React, {Component, PropTypes} from 'react';
import Path from './Path';
import {pathProps} from '../lib/props';
import _ from 'lodash';

class Polyline extends Component{
    static displayName = 'Polyline';
    static propTypes = {
        ...pathProps,
        points: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired
    };

    static defaultProps = {
        points: ''
    };

    setNativeProps = (...args) => {
        this.root.getNativeElement().setNativeProps(...args);
    };

    render() {
        let points = this.props.points;
        if (_.isArray(points)) {
            points = points.join(',');
        }

        return <Path
            ref={ele => {this.root = ele;}}
            {...this.props}
            d={`M${points.trim().replace(/\s+/g, 'L')}`}
        />;
    }
}
export default Polyline;

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Path from './Path';
import {pathProps} from '../lib/props';
import extractPolyPoints from '../lib/extract/extractPolyPoints';

export default class extends Component{
    static displayName = 'Polygon';
    static propTypes = {
        ...pathProps,
        points: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired
    };

    static defaultProps = {
        points: ''
    };

    setNativeProps = (...args) => {
        //noinspection JSUnresolvedFunction
        this.root.getNativeElement().setNativeProps(...args);
    };

    render() {
        let points = this.props.points;
        if (Array.isArray(points)) {
            points = points.join(',');
        }

        return <Path
            ref={ele => {this.root = ele;}}
            {...this.props}
            d={`M${extractPolyPoints(points)}z`}
        />;
    }
}

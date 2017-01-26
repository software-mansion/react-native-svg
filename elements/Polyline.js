import React, {Component, PropTypes} from 'react';
import Path from './Path';
import {pathProps} from '../lib/props';
import _ from 'lodash';

// ALLOWS LIST OF COORDS SEPARATED BY SPACE OR COMPACTED DUE TO NEGATIVE SIGN
// SIMPLIFIES IMPORTING OF ILLUSTRATOR GENERATED POLYLINE WITHOUT ANY FURTHER MODIFIATION

const normalize = function(points) { return points.replace('-',' -').split(/[ ,]/).map((p,i) => { return i%2==1 ? ',' + p : i > 0 ? ' '+p : p}).join('') }

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
        } else {
            points = normalize(points);
        }

        return <Path
            ref={ele => {this.root = ele;}}
            {...this.props}
            d={`M${points.trim().replace(/\s+/g, 'L')}`}
        />;
    }
}
export default Polyline;

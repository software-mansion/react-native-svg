import React, {Component, PropTypes} from 'react';
import Path from './Path';
import {pathProps} from '../lib/props';

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
        this.root.getNativeElement().setNativeProps(...args);
    };

    render() {
        const points = this.props.points.replace(/,+/g, ' ').trim().split(' ')

        for (let i = 0; i < points.length; i += 2) {
          points[i] += ',';
          points[i+1] += ' ';
        }

        const pointsStr = points.join('');

        return <Path
            ref={ele => {this.root = ele;}}
            {...this.props}
            d={`M${pointsStr.trim().replace(/\s+/g, 'L')}z`}
        />;
    }
}

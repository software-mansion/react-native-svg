import React, {Component, PropTypes} from 'react';
import Path from './Path';
import {pathProps} from '../lib/props';

class Polygon extends Component{
    static displayName = 'Polygon';
    static propTypes = {
        ...pathProps,
        points: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
    };

    setNativeProps = (...args) => {
        this.root.getNativeElement().setNativeProps(...args);
    };

    render() {
        return <Path
            ref={ele => this.root = ele}
            {...this.props}
            d={`M${this.props.points.trim().replace(/\s+/g, 'L')}z`}
        />;
    }
}
export default Polygon;

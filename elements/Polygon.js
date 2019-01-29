import React from 'react';
import Path from './Path';
import Shape from './Shape';
import extractPolyPoints from '../lib/extract/extractPolyPoints';

export default class Polygon extends Shape {
  static displayName = 'Polygon';

  static defaultProps = {
    points: '',
  };

  setNativeProps = props => {
    const { points } = props;
    if (points) {
      props.d = `M${extractPolyPoints(points)}z`;
    }
    this.root.setNativeProps(props);
  };

  render() {
    const { props } = this;
    const { points } = props;
    return (
      <Path
        ref={this.refMethod}
        d={`M${extractPolyPoints(points)}z`}
        {...props}
      />
    );
  }
}

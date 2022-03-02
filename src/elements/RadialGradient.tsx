import React from 'react';
import extractGradient from '../lib/extract/extractGradient';
import Shape from './Shape';
import { RNSVGRadialGradient } from './NativeComponents';
import { RadialGradientProps } from './types';

export default class RadialGradient extends Shape<RadialGradientProps & {}> {
  static displayName = 'RadialGradient';

  static defaultProps = {
    cx: '50%',
    cy: '50%',
    r: '50%',
  };

  render() {
    const { props } = this;
    const { rx, ry, r, cx, cy, fx = cx, fy = cy } = props;
    const radialGradientProps = {
      fx,
      fy,
      rx: rx || r,
      ry: ry || r,
      cx,
      cy,
    };
    return (
      <RNSVGRadialGradient
        ref={this.refMethod}
        {...radialGradientProps}
        {...extractGradient(props, this)}
      />
    );
  }
}

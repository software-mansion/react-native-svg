import React from 'react';
import extractTransform from '../lib/extract/extractTransform';
import extractViewBox from '../lib/extract/extractViewBox';
import units from '../lib/units';
import Shape from './Shape';
import { RNSVGPattern } from './NativeComponents';
import { PatternProps } from './types';

export default class Pattern extends Shape<PatternProps> {
  static displayName = 'Pattern';

  static defaultProps = {
    x: '0%',
    y: '0%',
    width: '100%',
    height: '100%',
  };

  render() {
    const { props } = this;
    const {
      patternTransform,
      transform,
      id,
      x,
      y,
      width,
      height,
      patternUnits,
      patternContentUnits,
      children,
      viewBox,
      preserveAspectRatio,
    } = props;
    const matrix = extractTransform(patternTransform || transform || props);
    const patternProps = {
      name: id,
      x,
      y,
      width,
      height,
      matrix,
      patternTransform: matrix,
      patternUnits: (patternUnits && units[patternUnits]) || 0,
      patternContentUnits: patternContentUnits ? units[patternContentUnits] : 1,
    };
    return (
      <RNSVGPattern
        ref={this.refMethod}
        {...patternProps}
        {...extractViewBox({ viewBox, preserveAspectRatio })}
      >
        {children}
      </RNSVGPattern>
    );
  }
}

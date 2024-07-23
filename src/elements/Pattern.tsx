import type { ReactNode } from 'react';
import * as React from 'react';
import extractTransform from '../lib/extract/extractTransform';
import extractViewBox from '../lib/extract/extractViewBox';
import type { NumberProp, TransformProps, Units } from '../lib/extract/types';
import units from '../lib/units';
import Shape from './Shape';
import RNSVGPattern from '../fabric/PatternNativeComponent';
import type { NativeMethods } from 'react-native';

export interface PatternProps extends TransformProps {
  children?: ReactNode;
  id?: string;
  x?: NumberProp;
  y?: NumberProp;
  width?: NumberProp;
  height?: NumberProp;
  patternTransform?: TransformProps['transform'];
  patternUnits?: Units;
  patternContentUnits?: Units;
  viewBox?: string;
  preserveAspectRatio?: string;
}

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
      x,
      y,
      width,
      height,
      name: id,
      matrix,
      patternTransform: matrix,
      patternUnits: (patternUnits && units[patternUnits]) || 0,
      patternContentUnits: patternContentUnits ? units[patternContentUnits] : 1,
    };
    return (
      <RNSVGPattern
        ref={(ref) => this.refMethod(ref as (Pattern & NativeMethods) | null)}
        {...patternProps}
        {...extractViewBox({ viewBox, preserveAspectRatio })}>
        {children}
      </RNSVGPattern>
    );
  }
}

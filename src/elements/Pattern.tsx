import React, { ReactNode } from 'react';
import extractTransform from '../lib/extract/extractTransform';
import extractViewBox from '../lib/extract/extractViewBox';
import {
  ColumnMajorTransformMatrix,
  NumberProp,
  TransformProps,
  Units,
} from '../lib/extract/types';
import units from '../lib/units';
import Shape from './Shape';
import { RNSVGPattern } from './NativeComponents';
import { stringifyPropsForFabric } from '../lib/extract/extractProps';

export interface PatternProps {
  children?: ReactNode;
  id?: string;
  x?: NumberProp;
  y?: NumberProp;
  width?: NumberProp;
  height?: NumberProp;
  patternTransform?: ColumnMajorTransformMatrix | string;
  patternUnits?: Units;
  patternContentUnits?: Units;
  viewBox?: string;
  preserveAspectRatio?: string;
  transform?: ColumnMajorTransformMatrix | string | TransformProps;
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
    const strigifiedPatternProps = stringifyPropsForFabric({
      x,
      y,
      width,
      height,
    });
    const patternProps = {
      name: id,
      matrix,
      patternTransform: matrix,
      patternUnits: (patternUnits && units[patternUnits]) || 0,
      patternContentUnits: patternContentUnits ? units[patternContentUnits] : 1,
    };
    return (
      <RNSVGPattern
        ref={this.refMethod}
        {...strigifiedPatternProps}
        {...patternProps}
        {...extractViewBox({ viewBox, preserveAspectRatio })}
      >
        {children}
      </RNSVGPattern>
    );
  }
}

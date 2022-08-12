import React, { ReactElement } from 'react';
import extractGradient from '../lib/extract/extractGradient';
import {
  ColumnMajorTransformMatrix,
  NumberProp,
  Units,
} from '../lib/extract/types';
import Shape from './Shape';
import { RNSVGLinearGradient } from './NativeComponents';
import { stringifyPropsForFabric } from '../lib/extract/extractProps';

export interface LinearGradientProps {
  children?: ReactElement[];
  x1?: NumberProp;
  x2?: NumberProp;
  y1?: NumberProp;
  y2?: NumberProp;
  gradientUnits?: Units;
  gradientTransform?: ColumnMajorTransformMatrix | string;
  id?: string;
}

export default class LinearGradient extends Shape<LinearGradientProps> {
  static displayName = 'LinearGradient';

  static defaultProps = {
    x1: '0%',
    y1: '0%',
    x2: '100%',
    y2: '0%',
  };

  render() {
    const { props } = this;
    const { x1, y1, x2, y2 } = props;
    const linearGradientProps = stringifyPropsForFabric({ x1, y1, x2, y2 });
    return (
      <RNSVGLinearGradient
        ref={this.refMethod}
        {...linearGradientProps}
        {...extractGradient(props, this)}
      />
    );
  }
}

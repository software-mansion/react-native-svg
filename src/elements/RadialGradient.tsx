import React, { ReactElement } from 'react';
import extractGradient from '../lib/extract/extractGradient';
import {
  ColumnMajorTransformMatrix,
  NumberProp,
  Units,
} from '../lib/extract/types';
import Shape from './Shape';
import { RNSVGRadialGradient } from './NativeComponents';
import { stringifyPropsForFabric } from '../lib/extract/extractProps';

export interface RadialGradientProps {
  children?: ReactElement[];
  fx?: NumberProp;
  fy?: NumberProp;
  rx?: NumberProp;
  ry?: NumberProp;
  cx?: NumberProp;
  cy?: NumberProp;
  r?: NumberProp;
  gradientUnits?: Units;
  gradientTransform?: ColumnMajorTransformMatrix | string;
  id?: string;
}

export default class RadialGradient extends Shape<RadialGradientProps> {
  static displayName = 'RadialGradient';

  static defaultProps = {
    cx: '50%',
    cy: '50%',
    r: '50%',
  };

  render() {
    const { props } = this;
    const { rx, ry, r, cx, cy, fx = cx, fy = cy } = props;
    const radialGradientProps = stringifyPropsForFabric({
      fx,
      fy,
      rx: rx || r,
      ry: ry || r,
      cx,
      cy,
    });
    return (
      <RNSVGRadialGradient
        ref={this.refMethod}
        {...radialGradientProps}
        {...extractGradient(props, this)}
      />
    );
  }
}

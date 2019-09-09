import React, { ReactElement } from 'react';
import { requireNativeComponent } from 'react-native';
import extractGradient from '../lib/extract/extractGradient';
import { NumberProp, TransformProps } from '../lib/extract/types';
import Shape from './Shape';

export default class RadialGradient extends Shape<{
  fx?: NumberProp;
  fy?: NumberProp;
  rx?: NumberProp;
  ry?: NumberProp;
  r?: NumberProp;
  cx?: NumberProp;
  cy?: NumberProp;
  id?: string;
  children?: ReactElement[];
  transform?: number[] | string | TransformProps;
  gradientTransform?: number[] | string | TransformProps;
  gradientUnits?: 'objectBoundingBox' | 'userSpaceOnUse';
}> {
  static displayName = 'RadialGradient';

  static defaultProps = {
    fx: '50%',
    fy: '50%',
    cx: '50%',
    cy: '50%',
    r: '50%',
  };

  render() {
    const { props } = this;
    const { fx, fy, rx, ry, r, cx, cy } = props;
    return (
      <RNSVGRadialGradient
        ref={this.refMethod}
        fx={fx}
        fy={fy}
        rx={rx || r}
        ry={ry || r}
        cx={cx}
        cy={cy}
        {...extractGradient(props, this)}
      />
    );
  }
}

export const RNSVGRadialGradient = requireNativeComponent(
  'RNSVGRadialGradient',
);

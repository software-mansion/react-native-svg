import type { ReactElement } from 'react';
import * as React from 'react';
import extractGradient from '../lib/extract/extractGradient';
import type { NumberProp, TransformProps, Units } from '../lib/extract/types';
import Shape from './Shape';
import RNSVGRadialGradient from '../fabric/RadialGradientNativeComponent';
import { stringifyPropsForFabric } from '../lib/extract/extractProps';
import type { NativeMethods } from 'react-native';

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
  gradientTransform?: TransformProps['transform'];
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
        ref={(ref) =>
          this.refMethod(ref as (RadialGradient & NativeMethods) | null)
        }
        {...radialGradientProps}
        {...extractGradient(props, this)}
      />
    );
  }
}

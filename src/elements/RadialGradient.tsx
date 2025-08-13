import type { ReactElement } from 'react';
import * as React from 'react';
import extractGradient from '../lib/extract/extractGradient';
import type { NumberProp, TransformProps, Units } from '../lib/extract/types';
import Shape from './Shape';
import RNSVGRadialGradient from '../fabric/RadialGradientNativeComponent';
import type { NativeMethods } from 'react-native';
import { extractTransformSvgView } from '../lib/extract/extractTransform';

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
    const radialGradientProps = {
      fx,
      fy,
      rx: rx || r,
      ry: ry || r,
      cx,
      cy,
    };
    const gradientProps = extractGradient(props, this);

    if (gradientProps) {
      const { gradientTransform, ...extractedProps } = gradientProps;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transform = extractTransformSvgView({
        transform: props.gradientTransform,
      } as any);

      return (
        <RNSVGRadialGradient
          ref={(ref) =>
            this.refMethod(ref as (RadialGradient & NativeMethods) | null)
          }
          {...radialGradientProps}
          {...extractedProps}
          transform={transform}
        />
      );
    }

    return (
      <RNSVGRadialGradient
        ref={(ref) =>
          this.refMethod(ref as (RadialGradient & NativeMethods) | null)
        }
        {...radialGradientProps}
      />
    );
  }
}

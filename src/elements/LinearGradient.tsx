import type { ReactElement } from 'react';
import * as React from 'react';
import extractGradient from '../lib/extract/extractGradient';
import type { NumberProp, TransformProps, Units } from '../lib/extract/types';
import Shape from './Shape';
import RNSVGLinearGradient from '../fabric/LinearGradientNativeComponent';
import type { NativeMethods } from 'react-native';
import { extractTransformSvgView } from '../lib/extract/extractTransform';

export interface LinearGradientProps {
  children?: ReactElement[];
  x1?: NumberProp;
  x2?: NumberProp;
  y1?: NumberProp;
  y2?: NumberProp;
  gradientUnits?: Units;
  gradientTransform?: TransformProps['transform'];
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
    const linearGradientProps = { x1, y1, x2, y2 };
    const gradientProps = extractGradient(props, this);

    if (gradientProps) {
      const { gradientTransform, ...extractedProps } = gradientProps;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transform = extractTransformSvgView({
        transform: props.gradientTransform,
      } as any);

      return (
        <RNSVGLinearGradient
          ref={(ref) =>
            this.refMethod(ref as (LinearGradient & NativeMethods) | null)
          }
          {...linearGradientProps}
          {...extractedProps}
          transform={transform}
        />
      );
    }

    return (
      <RNSVGLinearGradient
        ref={(ref) =>
          this.refMethod(ref as (LinearGradient & NativeMethods) | null)
        }
        {...linearGradientProps}
      />
    );
  }
}

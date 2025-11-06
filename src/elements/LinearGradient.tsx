import type { ReactElement } from 'react';
import * as React from 'react';
import extractGradient from '../lib/extract/extractGradient';
import type { NumberProp, TransformProps, Units } from '../lib/extract/types';
import Shape from './Shape';
import RNSVGLinearGradient from '../fabric/LinearGradientNativeComponent';
import type { NativeMethods } from 'react-native';

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
    return (
      <RNSVGLinearGradient
        ref={(ref) =>
          this.refMethod(ref as (LinearGradient & NativeMethods) | null)
        }
        {...linearGradientProps}
        {...extractGradient(props, this)}
      />
    );
  }
}

import React from 'react';
import { NativeMethods } from 'react-native';
import RNSVGFeComposite from '../../fabric/FeCompositeNativeComponent';
import {
  extractFeComposite,
  extractFilter,
} from '../../lib/extract/extractFilter';
import { NumberProp } from '../../lib/extract/types';
import FilterPrimitive from './FilterPrimitive';

type FeCompositeOperator =
  | 'over'
  | 'in'
  | 'out'
  | 'atop'
  | 'xor'
  | 'arithmetic';

export interface FeCompositeProps {
  in?: string;
  in2?: string;
  operator?: FeCompositeOperator;
  k1?: NumberProp;
  k2?: NumberProp;
  k3?: NumberProp;
  k4?: NumberProp;
}

export default class FeComposite extends FilterPrimitive<FeCompositeProps> {
  static displayName = 'FeComposite';

  static defaultProps = {
    ...this.defaultPrimitiveProps,
    k1: 0,
    k2: 0,
    k3: 0,
    k4: 0,
  };

  render() {
    return (
      <RNSVGFeComposite
        ref={(ref) =>
          this.refMethod(ref as (FeComposite & NativeMethods) | null)
        }
        {...extractFilter(this.props)}
        {...extractFeComposite(this.props)}
      />
    );
  }
}

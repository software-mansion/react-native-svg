import React from 'react';
import { NativeMethods } from 'react-native';
import RNSVGFeOffset from '../../fabric/FeOffsetNativeComponent';
import { extractFilter, extractIn } from '../../lib/extract/extractFilter';
import { NumberProp } from '../../lib/extract/types';
import FilterPrimitive from './FilterPrimitive';

export interface FeOffsetProps {
  in?: string;
  dx?: NumberProp;
  dy?: NumberProp;
}

export default class FeOffset extends FilterPrimitive<FeOffsetProps> {
  static displayName = 'FeOffset';

  static defaultProps: React.ComponentProps<typeof FeOffset> = {
    ...this.defaultPrimitiveProps,
    dx: 0,
    dy: 0,
  };

  render() {
    return (
      <RNSVGFeOffset
        ref={(ref) => this.refMethod(ref as (FeOffset & NativeMethods) | null)}
        {...this.props}
        {...extractFilter(this.props)}
        {...extractIn(this.props)}
      />
    );
  }
}

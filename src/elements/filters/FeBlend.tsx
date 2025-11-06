import React from 'react';
import { NativeMethods } from 'react-native';
import {
  extractFeBlend,
  extractFilter,
  extractIn,
} from '../../lib/extract/extractFilter';
import RNSVGFeBlend from '../../fabric/FeBlendNativeComponent';
import FilterPrimitive from './FilterPrimitive';

type BlendMode = 'normal' | 'multiply' | 'screen' | 'darken' | 'lighten';

export interface FeBlendProps {
  in?: string;
  in2?: string;
  mode?: BlendMode;
}

export default class FeBlend extends FilterPrimitive<FeBlendProps> {
  static displayName = 'FeBlend';

  static defaultProps = {
    ...this.defaultPrimitiveProps,
    mode: 'normal',
  };

  render() {
    return (
      <RNSVGFeBlend
        ref={(ref) => this.refMethod(ref as (FeBlend & NativeMethods) | null)}
        {...extractFilter(this.props)}
        {...extractIn(this.props)}
        {...extractFeBlend(this.props)}
      />
    );
  }
}

import * as React from 'react';
import { NativeMethods } from 'react-native';
import RNSVGFeGaussianBlur from '../../fabric/FeGaussianBlurNativeComponent';
import {
  extractFeGaussianBlur,
  extractFilter,
  extractIn,
} from '../../lib/extract/extractFilter';
import { FilterEdgeMode, NumberArray } from '../../lib/extract/types';
import FilterPrimitive from './FilterPrimitive';

export interface FeGaussianBlurProps {
  in?: string;
  stdDeviation?: NumberArray;
  // edgeMode is hard to implement and not supported by any
  // browser except safari, so it's not implemented for now
  // https://caniuse.com/mdn-api_svgfegaussianblurelement_edgemode
  edgeMode?: FilterEdgeMode;
}

export default class FeGaussianBlur extends FilterPrimitive<FeGaussianBlurProps> {
  static displayName = 'FeGaussianBlur';

  static defaultProps: React.ComponentProps<typeof FeGaussianBlur> = {
    ...this.defaultPrimitiveProps,
    stdDeviation: 0,
    edgeMode: 'none',
  };

  render() {
    return (
      <RNSVGFeGaussianBlur
        ref={(ref) =>
          this.refMethod(ref as (FeGaussianBlur & NativeMethods) | null)
        }
        {...extractFilter(this.props)}
        {...extractIn(this.props)}
        {...extractFeGaussianBlur(this.props)}
      />
    );
  }
}

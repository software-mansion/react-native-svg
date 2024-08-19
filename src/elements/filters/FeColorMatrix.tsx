import * as React from 'react';
import { NativeMethods } from 'react-native';
import RNSVGFeColorMatrix from '../../fabric/FeColorMatrixNativeComponent';
import {
  extractFeColorMatrix,
  extractFilter,
  extractIn,
} from '../../lib/extract/extractFilter';
import { FilterColorMatrixType, NumberArray } from '../../lib/extract/types';
import FilterPrimitive from './FilterPrimitive';

export type FeColorMatrixProps = {
  in?: string;
  type?: FilterColorMatrixType;
  values?: NumberArray;
};

export default class FeColorMatrix extends FilterPrimitive<FeColorMatrixProps> {
  static displayName = 'FeColorMatrix';

  static defaultProps: React.ComponentProps<typeof FeColorMatrix> = {
    ...this.defaultPrimitiveProps,
    type: 'matrix',
    values: '',
  };

  render() {
    return (
      <RNSVGFeColorMatrix
        ref={(ref) =>
          this.refMethod(ref as (FeColorMatrix & NativeMethods) | null)
        }
        {...extractFilter(this.props)}
        {...extractIn(this.props)}
        {...extractFeColorMatrix(this.props)}
      />
    );
  }
}

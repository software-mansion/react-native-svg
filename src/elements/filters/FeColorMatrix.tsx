import * as React from 'react';
import { NativeMethods } from 'react-native';
import RNSVGFeColorMatrix from '../../fabric/FeColorMatrixNativeComponent';
import {
  extractFeColorMatrix,
  extractFilter,
} from '../../lib/extract/extractFilter';
import { FilterColorMatrixType } from '../../lib/extract/types';
import FilterPrimitive from './FilterPrimitive';

export type FeColorMatrixProps = {
  in?: string;
  type?: FilterColorMatrixType;
  values?: number | Array<number> | string;
};

export default class FeColorMatrix extends FilterPrimitive<FeColorMatrixProps> {
  static displayName = 'FeColorMatrix';

  static defaultProps = {
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
        {...extractFeColorMatrix(this.props)}
      />
    );
  }
}

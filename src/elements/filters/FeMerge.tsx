import React from 'react';
import { NativeMethods } from 'react-native';
import RNSVGFeMerge from '../../fabric/FeMergeNativeComponent';
import { extractFeMerge, extractFilter } from '../../lib/extract/extractFilter';
import FilterPrimitive from './FilterPrimitive';

export interface FeMergeProps {
  children?: React.ReactElement | Array<React.ReactElement>;
}

export default class FeMerge extends FilterPrimitive<FeMergeProps> {
  static displayName = 'FeMerge';

  static defaultProps = {
    ...this.defaultPrimitiveProps,
  };

  render() {
    return (
      <RNSVGFeMerge
        ref={(ref) => this.refMethod(ref as (FeMerge & NativeMethods) | null)}
        {...extractFilter(this.props)}
        {...extractFeMerge(this.props, this)}
      />
    );
  }
}

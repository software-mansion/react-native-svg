import React from 'react';
import FilterPrimitive from './FilterPrimitive';
import { RNSVGFeComponentTransfer } from '../../fabric';
import { extractFilter, extractIn } from '../../lib/extract/extractFilter';
import { NativeMethods } from 'react-native';

export interface FeComponentTransferProps {
  in?: string;
  children?: React.ReactElement | Array<React.ReactElement>;
}

export default class FeComponentTransfer extends FilterPrimitive<FeComponentTransferProps> {
  static displayName = 'FeComponentTransfer';

  static defaultProps = {
    ...this.defaultPrimitiveProps,
  };

  render() {
    return (
      <RNSVGFeComponentTransfer
        ref={(ref) =>
          this.refMethod(ref as (FeComponentTransfer & NativeMethods) | null)
        }
        {...extractFilter(this.props)}
        {...extractIn(this.props)}
        children={this.props.children}
      />
    );
  }
}

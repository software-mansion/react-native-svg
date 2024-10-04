import * as React from 'react';
import { warnUnimplementedFilter } from '../../lib/util';
import FilterPrimitive from './FilterPrimitive';

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
    warnUnimplementedFilter();
    return null;
  }
}

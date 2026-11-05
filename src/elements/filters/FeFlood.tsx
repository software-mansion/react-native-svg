import React from 'react';
import { ColorValue, HostInstance } from 'react-native';
import RNSVGFeFlood from '../../fabric/FeFloodNativeComponent';
import extractFeFlood, { extractFilter } from '../../lib/extract/extractFilter';
import { NumberProp } from '../../lib/extract/types';
import FilterPrimitive from './FilterPrimitive';

export interface FeFloodProps {
  in?: string;
  floodColor?: ColorValue;
  floodOpacity?: NumberProp;
}

export default class FeFlood extends FilterPrimitive<FeFloodProps> {
  static displayName = 'FeFlood';

  static defaultProps: React.ComponentProps<typeof FeFlood> = {
    ...this.defaultPrimitiveProps,
    floodColor: 'black',
    floodOpacity: 1,
  };

  render() {
    return (
      <RNSVGFeFlood
        ref={(ref) => this.refMethod(ref as (FeFlood & HostInstance) | null)}
        {...extractFilter(this.props)}
        {...extractFeFlood(this.props)}
      />
    );
  }
}

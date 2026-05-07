import React from 'react';
import { NativeMethods } from 'react-native';
import RNSVGFilter from '../../fabric/FilterNativeComponent';
import { NumberProp, Units } from '../../lib/extract/types';
import Shape from '../Shape';

export interface FilterProps {
  children?: React.ReactNode;
  id?: string;
  x?: NumberProp;
  y?: NumberProp;
  width?: NumberProp;
  height?: NumberProp;
  filterUnits?: Units;
  primitiveUnits?: Units;
}

export default class Filter extends Shape<FilterProps> {
  static displayName = 'Filter';

  static defaultProps: React.ComponentProps<typeof Filter> = {
    x: '-10%',
    y: '-10%',
    width: '120%',
    height: '120%',
    filterUnits: 'objectBoundingBox',
    primitiveUnits: 'userSpaceOnUse',
  };

  static validUnits = new Set(['userSpaceOnUse', 'objectBoundingBox']);

  render() {
    const { id, x, y, width, height, filterUnits, primitiveUnits } = this.props;

    let validFilterUnits = filterUnits;
    if (filterUnits && !Filter.validUnits.has(filterUnits)) {
      console.warn(`RNSVG: Unsupported filterUnits "${filterUnits}"`);
      validFilterUnits = 'objectBoundingBox';
    }
    let validPrimitiveUnits = primitiveUnits;
    if (primitiveUnits && !Filter.validUnits.has(primitiveUnits)) {
      console.warn(`RNSVG: Unsupported primitiveUnits "${primitiveUnits}"`);
      validPrimitiveUnits = 'userSpaceOnUse';
    }

    const filterProps = {
      name: id,
      x,
      y,
      width,
      height,
      filterUnits: validFilterUnits,
      primitiveUnits: validPrimitiveUnits,
    };
    return (
      <RNSVGFilter
        ref={(ref) => this.refMethod(ref as (Filter & NativeMethods) | null)}
        {...filterProps}>
        {this.props.children}
      </RNSVGFilter>
    );
  }
}

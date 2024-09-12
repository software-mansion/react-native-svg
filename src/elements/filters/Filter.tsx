import * as React from 'react';
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

  render() {
    const { id, x, y, width, height, filterUnits, primitiveUnits } = this.props;

    const filterProps = {
      name: id,
      x,
      y,
      width,
      height,
      filterUnits,
      primitiveUnits,
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

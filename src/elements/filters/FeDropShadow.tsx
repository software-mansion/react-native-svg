import React from 'react';
import { ColorValue } from 'react-native';
import { NumberArray, NumberProp } from '../../lib/extract/types';
import FeFlood from './FeFlood';
import FeGaussianBlur from './FeGaussianBlur';
import FeMerge from './FeMerge';
import FeMergeNode from './FeMergeNode';
import FeOffset from './FeOffset';
import FilterPrimitive from './FilterPrimitive';
import FeComposite from './FeComposite';

export interface FeDropShadowProps {
  in?: string;
  stdDeviation?: NumberArray;
  dx?: NumberProp;
  dy?: NumberProp;
  floodColor?: ColorValue;
  floodOpacity?: NumberProp;
}

export default class FeDropShadow extends FilterPrimitive<FeDropShadowProps> {
  static displayName = 'FeDropShadow';

  static defaultProps = {
    ...this.defaultPrimitiveProps,
  };

  render() {
    const {
      stdDeviation,
      in: in1 = 'SourceGraphic',
      dx,
      dy,
      result,
    } = this.props;
    return (
      <React.Fragment>
        <FeGaussianBlur in={in1} stdDeviation={stdDeviation} />
        <FeOffset dx={dx} dy={dy} result="offsetblur" />
        <FeFlood
          floodColor={this.props.floodColor}
          floodOpacity={this.props.floodOpacity}
        />
        <FeComposite in2="offsetblur" operator="in" />
        <FeMerge result={result}>
          <FeMergeNode />
          <FeMergeNode in={in1} />
        </FeMerge>
      </React.Fragment>
    );
  }
}

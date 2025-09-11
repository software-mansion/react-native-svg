import React from 'react';
import { NumberArray, NumberProp } from '../../lib/extract/types';
import FilterPrimitive from './FilterPrimitive';
import { RNSVGFeComponentTransferFunction } from '../../fabric';
import { NativeMethods } from 'react-native';
import {
  extractFeComponentTransferFunction,
  extractFilter,
} from '../../lib/extract/extractFilter';

type FunctionChannel = 'R' | 'G' | 'B' | 'A' | 'UNKNOWN';
type FunctionType = 'identity' | 'table' | 'discrete' | 'linear' | 'gamma';

export type FeComponentTransferFunctionProps = {
  type: FunctionType;
  tableValues?: NumberArray;
  slope?: NumberProp;
  intercept?: NumberProp;
  amplitude?: NumberProp;
  exponent?: NumberProp;
  offset?: NumberProp;
};

export default class FeComponentTransferFunction extends FilterPrimitive<FeComponentTransferFunctionProps> {
  channel: FunctionChannel = 'UNKNOWN';
  static defaultProps: React.ComponentProps<
    typeof FeComponentTransferFunction
  > = {
    type: 'identity',
    tableValues: [],
    slope: 1,
    intercept: 0,
    amplitude: 1,
    exponent: 1,
    offset: 0,
  };

  render() {
    return (
      <RNSVGFeComponentTransferFunction
        ref={(ref) =>
          this.refMethod(
            ref as (FeComponentTransferFunction & NativeMethods) | null
          )
        }
        {...extractFilter(this.props)}
        {...extractFeComponentTransferFunction(this.props)}
        channel={this.channel}
      />
    );
  }
}

export type FeFuncRProps = FeComponentTransferFunctionProps;
export class FeFuncR extends FeComponentTransferFunction {
  static displayName = 'FeFuncR';
  channel: FunctionChannel = 'R';
}

export type FeFuncGProps = FeComponentTransferFunctionProps;
export class FeFuncG extends FeComponentTransferFunction {
  static displayName = 'FeFuncG';
  channel: FunctionChannel = 'G';
}

export type FeFuncBProps = FeComponentTransferFunctionProps;
export class FeFuncB extends FeComponentTransferFunction {
  static displayName = 'FeFuncB';
  channel: FunctionChannel = 'B';
}

export type FeFuncAProps = FeComponentTransferFunctionProps;
export class FeFuncA extends FeComponentTransferFunction {
  static displayName = 'FeFuncA';
  channel: FunctionChannel = 'A';
}

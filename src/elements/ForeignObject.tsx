import React, { ReactNode } from 'react';
import {
  withoutXY,
  stringifyPropsForFabric,
} from '../lib/extract/extractProps';
import { NumberProp } from '../lib/extract/types';
import G from './G';
import { RNSVGForeignObject } from './NativeComponents';

export interface ForeignObjectProps {
  children?: ReactNode;
  x?: NumberProp;
  y?: NumberProp;
  width?: NumberProp;
  height?: NumberProp;
}

export default class ForeignObject extends G<ForeignObjectProps> {
  static displayName = 'ForeignObject';

  static defaultProps = {
    x: '0%',
    y: '0%',
    width: '100%',
    height: '100%',
  };

  render() {
    const { props } = this;
    const { x, y, width, height, children } = props;
    const foreignObjectProps = stringifyPropsForFabric({ x, y, width, height });
    return (
      <RNSVGForeignObject
        ref={this.refMethod}
        {...withoutXY(this, props)}
        {...foreignObjectProps}
      >
        {children}
      </RNSVGForeignObject>
    );
  }
}

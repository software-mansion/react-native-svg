import React from 'react';
import { withoutXY } from '../lib/extract/extractProps';
import G from './G';
import { RNSVGForeignObject } from './NativeComponents';
import { ForeignObjectProps } from './types';

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
    const foreignObjectProps = { x, y, width, height };
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

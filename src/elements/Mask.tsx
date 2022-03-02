import React from 'react';
import extractTransform from '../lib/extract/extractTransform';
import { withoutXY } from '../lib/extract/extractProps';
import units from '../lib/units';
import Shape from './Shape';
import { RNSVGMask } from './NativeComponents';
import { MaskProps } from './types';

export default class Mask extends Shape<MaskProps> {
  static displayName = 'Mask';

  static defaultProps = {
    x: '0%',
    y: '0%',
    width: '100%',
    height: '100%',
  };

  render() {
    const { props } = this;
    const {
      maskTransform,
      transform,
      x,
      y,
      width,
      height,
      maskUnits,
      maskContentUnits,
      children,
    } = props;
    const maskProps = {
      x,
      y,
      width,
      height,
      maskTransform: extractTransform(maskTransform || transform || props),
      maskUnits: maskUnits !== undefined ? units[maskUnits] : 0,
      maskContentUnits:
        maskContentUnits !== undefined ? units[maskContentUnits] : 1,
    };
    return (
      <RNSVGMask
        ref={this.refMethod}
        {...withoutXY(this, props)}
        {...maskProps}
      >
        {children}
      </RNSVGMask>
    );
  }
}

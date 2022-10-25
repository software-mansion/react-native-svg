import React, { ReactNode } from 'react';
import {
  stringifyPropsForFabric,
  withoutXY,
} from '../lib/extract/extractProps';
import { CommonPathProps, NumberProp } from '../lib/extract/types';
import units from '../lib/units';
import Shape from './Shape';
import { RNSVGMask } from '../ReactNativeSVG';
import { NativeMethods } from 'react-native';

export type TMaskUnits = 'userSpaceOnUse' | 'objectBoundingBox';

export interface MaskProps extends CommonPathProps {
  children?: ReactNode;
  id?: string;
  x?: NumberProp;
  y?: NumberProp;
  width?: NumberProp;
  height?: NumberProp;
  maskUnits?: TMaskUnits;
  maskContentUnits?: TMaskUnits;
}

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
    const { x, y, width, height, maskUnits, maskContentUnits, children } =
      props;
    const strigifiedMaskProps = stringifyPropsForFabric({
      x,
      y,
      width,
      height,
    });
    const maskProps = {
      maskUnits: maskUnits !== undefined ? units[maskUnits] : 0,
      maskContentUnits:
        maskContentUnits !== undefined ? units[maskContentUnits] : 1,
    };
    return (
      <RNSVGMask
        ref={(ref) => this.refMethod(ref as (Mask & NativeMethods) | null)}
        {...withoutXY(this, props)}
        {...strigifiedMaskProps}
        {...maskProps}
      >
        {children}
      </RNSVGMask>
    );
  }
}

import type { ReactNode } from 'react';
import * as React from 'react';
import { withoutXY } from '../lib/extract/extractProps';
import type { CommonPathProps, NumberProp } from '../lib/extract/types';
import units from '../lib/units';
import Shape from './Shape';
import RNSVGMask from '../fabric/MaskNativeComponent';
import type { NativeMethods } from 'react-native';

export type TMaskUnits = 'userSpaceOnUse' | 'objectBoundingBox';
export type TMaskType = 'alpha' | 'luminance';

export interface MaskProps extends CommonPathProps {
  children?: ReactNode;
  id?: string;
  x?: NumberProp;
  y?: NumberProp;
  width?: NumberProp;
  height?: NumberProp;
  maskUnits?: TMaskUnits;
  maskContentUnits?: TMaskUnits;
  maskType?: TMaskType;
  style?: {
    maskType: TMaskType;
  };
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
    const {
      x,
      y,
      width,
      height,
      maskUnits,
      maskContentUnits,
      children,
      maskType,
      style,
    } = props;
    const maskProps = {
      x,
      y,
      width,
      height,
      maskUnits: maskUnits !== undefined ? units[maskUnits] : 0,
      maskContentUnits:
        maskContentUnits !== undefined ? units[maskContentUnits] : 1,
      maskType: maskType || style?.maskType || 'luminance',
    };
    return (
      <RNSVGMask
        ref={(ref) => this.refMethod(ref as (Mask & NativeMethods) | null)}
        {...withoutXY(this, props)}
        {...maskProps}>
        {children}
      </RNSVGMask>
    );
  }
}

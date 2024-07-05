import type { ReactNode } from 'react';
import * as React from 'react';
import { withoutXY } from '../lib/extract/extractProps';
import type {
  CommonPathProps,
  MaskType,
  NumberProp,
  Units,
} from '../lib/extract/types';
import units from '../lib/units';
import Shape from './Shape';
import RNSVGMask from '../fabric/MaskNativeComponent';
import type { NativeMethods } from 'react-native';
import { maskType } from '../lib/maskType';

export interface MaskProps extends CommonPathProps {
  children?: ReactNode;
  id?: string;
  x?: NumberProp;
  y?: NumberProp;
  width?: NumberProp;
  height?: NumberProp;
  maskUnits?: Units;
  maskContentUnits?: Units;
  maskType?: MaskType;
  style?: {
    maskType: MaskType;
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
      maskType: maskType[props?.maskType || style?.maskType || 'luminance'],
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

import type { ReactNode } from 'react';
import React from 'react';
import {
  withoutXY,
  stringifyPropsForFabric,
} from '../lib/extract/extractProps';
import type { NumberProp } from '../lib/extract/types';
import G from './G';
import RNSVGForeignObject from '../fabric/ForeignObjectNativeComponent';
import type { NativeMethods } from 'react-native';

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
        ref={(ref) =>
          this.refMethod(ref as (ForeignObject & NativeMethods) | null)
        }
        {...withoutXY(this, props)}
        {...foreignObjectProps}
      >
        {children}
      </RNSVGForeignObject>
    );
  }
}

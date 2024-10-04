import type { ReactNode } from 'react';
import * as React from 'react';
import type { NativeMethods } from 'react-native';
import RNSVGForeignObject from '../fabric/ForeignObjectNativeComponent';
import { withoutXY } from '../lib/extract/extractProps';
import type { NumberProp } from '../lib/extract/types';
import G from './G';

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
    const foreignObjectProps = { x, y, width, height };
    return (
      <RNSVGForeignObject
        ref={(ref) =>
          this.refMethod(ref as (ForeignObject & NativeMethods) | null)
        }
        {...withoutXY(this, props)}
        {...foreignObjectProps}>
        {children}
      </RNSVGForeignObject>
    );
  }
}

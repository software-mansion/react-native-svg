import type { ReactNode } from 'react';
import * as React from 'react';
import { withoutXY } from '../lib/extract/extractProps';
import type { NumberProp } from '../lib/extract/types';
import G from './G';
import RNSVGForeignObject from '../fabric/ForeignObjectNativeComponent';
import type { NativeMethods } from 'react-native';
import { extractTransformSvgView } from '../lib/extract/extractTransform';

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
    const extractedProps = withoutXY(this, props);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transform = extractTransformSvgView(props as any);

    return (
      <RNSVGForeignObject
        ref={(ref) =>
          this.refMethod(ref as (ForeignObject & NativeMethods) | null)
        }
        {...extractedProps}
        {...foreignObjectProps}
        style={{ transform }}>
        {children}
      </RNSVGForeignObject>
    );
  }
}

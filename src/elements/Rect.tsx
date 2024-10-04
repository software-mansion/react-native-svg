import * as React from 'react';
import type { NativeMethods } from 'react-native';
import RNSVGRect from '../fabric/RectNativeComponent';
import { withoutXY } from '../lib/extract/extractProps';
import type { CommonPathProps, NumberProp } from '../lib/extract/types';
import Shape from './Shape';

export interface RectProps extends CommonPathProps {
  x?: NumberProp;
  y?: NumberProp;
  width?: NumberProp;
  height?: NumberProp;
  rx?: NumberProp;
  ry?: NumberProp;
  opacity?: NumberProp;
}

export default class Rect extends Shape<RectProps> {
  static displayName = 'Rect';

  static defaultProps = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };

  render() {
    const { props } = this;
    const { x, y, width, height, rx, ry } = props;
    const rectProps = { x, y, width, height, rx, ry };
    return (
      <RNSVGRect
        ref={(ref) => this.refMethod(ref as (Rect & NativeMethods) | null)}
        {...withoutXY(this, props)}
        {...rectProps}
      />
    );
  }
}

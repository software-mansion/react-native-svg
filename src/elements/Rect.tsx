import * as React from 'react';
import { withoutXY } from '../lib/extract/extractProps';
import type { CommonPathProps, NumberProp } from '../lib/extract/types';
import Shape from './Shape';
import RNSVGRect from '../fabric/RectNativeComponent';
import type { NativeMethods } from 'react-native';
import { extractTransformSvgView } from '../lib/extract/extractTransform';

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
    const extractedProps = withoutXY(this, props);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transform = extractTransformSvgView(props as any);

    return (
      <RNSVGRect
        ref={(ref) => this.refMethod(ref as (Rect & NativeMethods) | null)}
        {...extractedProps}
        {...rectProps}
        style={{ transform }}
      />
    );
  }
}

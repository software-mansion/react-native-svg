import React from 'react';
import {
  stringifyPropsForFabric,
  withoutXY,
} from '../lib/extract/extractProps';
import { CommonPathProps, NumberProp } from '../lib/extract/types';
import Shape from './Shape';
import { RNSVGRect } from '../ReactNativeSVG';
import { NativeMethods } from 'react-native';

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
    const rectProps = stringifyPropsForFabric({ x, y, width, height, rx, ry });
    return (
      <RNSVGRect
        ref={(ref) => this.refMethod(ref as (Rect & NativeMethods) | null)}
        {...withoutXY(this, props)}
        {...rectProps}
      />
    );
  }
}

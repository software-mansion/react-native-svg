import React from 'react';
import { requireNativeComponent } from 'react-native';
import extractProps, { propsAndStyles } from '../lib/extract/extractProps';
import { NumberProp } from '../lib/extract/types';
import Shape from './Shape';

export default class Rect extends Shape<{
  x?: NumberProp;
  y?: NumberProp;
  width?: NumberProp;
  height?: NumberProp;
  rx?: NumberProp;
  ry?: NumberProp;
}> {
  static displayName = 'Rect';

  static defaultProps = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    rx: 0,
    ry: 0,
  };

  render() {
    const { props } = this;
    const { x, y, width, height, rx, ry } = props;
    return (
      <RNSVGRect
        ref={this.refMethod}
        {...extractProps(
          {
            ...propsAndStyles(props),
            x: null,
            y: null,
          },
          this,
        )}
        x={x}
        y={y}
        width={width}
        height={height}
        rx={rx}
        ry={ry}
      />
    );
  }
}

export const RNSVGRect = requireNativeComponent('RNSVGRect');

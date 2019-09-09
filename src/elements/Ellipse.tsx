import React from 'react';
import { requireNativeComponent } from 'react-native';
import extractProps, { propsAndStyles } from '../lib/extract/extractProps';
import { NumberProp } from '../lib/extract/types';
import Shape from './Shape';

export default class Ellipse extends Shape<{
  cx?: NumberProp;
  cy?: NumberProp;
  rx?: NumberProp;
  ry?: NumberProp;
}> {
  static displayName = 'Ellipse';

  static defaultProps = {
    cx: 0,
    cy: 0,
    rx: 0,
    ry: 0,
  };

  render() {
    const { props } = this;
    const { cx, cy, rx, ry } = props;
    return (
      <RNSVGEllipse
        ref={this.refMethod}
        {...extractProps(propsAndStyles(props), this)}
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
      />
    );
  }
}

export const RNSVGEllipse = requireNativeComponent('RNSVGEllipse');

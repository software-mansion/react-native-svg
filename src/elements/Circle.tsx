import React from 'react';
import { requireNativeComponent } from 'react-native';
import extractProps, { propsAndStyles } from '../lib/extract/extractProps';
import { NumberProp } from '../lib/extract/types';
import Shape from './Shape';

export default class Circle extends Shape<{
  cx?: NumberProp;
  cy?: NumberProp;
  r?: NumberProp;
}> {
  static displayName = 'Circle';

  static defaultProps = {
    cx: 0,
    cy: 0,
    r: 0,
  };

  render() {
    const { props } = this;
    const { cx, cy, r } = props;
    return (
      <RNSVGCircle
        ref={this.refMethod}
        {...extractProps(propsAndStyles(props), this)}
        cx={cx}
        cy={cy}
        r={r}
      />
    );
  }
}

export const RNSVGCircle = requireNativeComponent('RNSVGCircle');

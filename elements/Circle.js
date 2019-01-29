import React from 'react';
import { requireNativeComponent } from 'react-native';
import extractProps, { propsAndStyles } from '../lib/extract/extractProps';
import Shape from './Shape';

export default class Circle extends Shape {
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

const RNSVGCircle = requireNativeComponent('RNSVGCircle');

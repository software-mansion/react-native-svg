import React from 'react';
import { extract } from '../lib/extract/extractProps';
import Shape from './Shape';
import { RNSVGEllipse } from './NativeComponents';
import { EllipseProps } from './types';

export default class Ellipse extends Shape<EllipseProps> {
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
    const ellipseProps = { ...extract(this, props), cx, cy, rx, ry };
    return <RNSVGEllipse ref={this.refMethod} {...ellipseProps} />;
  }
}

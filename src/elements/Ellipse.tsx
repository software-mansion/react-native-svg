import React from 'react';
import { extract } from '../lib/extract/extractProps';
import { CommonPathProps, NumberProp } from '../lib/extract/types';
import Shape from './Shape';
import { RNSVGEllipse } from './NativeComponents';

export interface EllipseProps extends CommonPathProps {
  cx?: NumberProp;
  cy?: NumberProp;
  opacity?: NumberProp;
  rx?: NumberProp;
  ry?: NumberProp;
}

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

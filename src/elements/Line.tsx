import React from 'react';
import { extract } from '../lib/extract/extractProps';
import { CommonPathProps, NumberProp } from '../lib/extract/types';
import Shape from './Shape';
import { RNSVGLine } from './NativeComponents';

export interface LineProps extends CommonPathProps {
  opacity?: NumberProp;
  x1?: NumberProp;
  x2?: NumberProp;
  y1?: NumberProp;
  y2?: NumberProp;
}

export default class Line extends Shape<LineProps> {
  static displayName = 'Line';

  static defaultProps = {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  };

  render() {
    const { props } = this;
    const { x1, y1, x2, y2 } = props;
    const lineProps = { ...extract(this, props), x1, y1, x2, y2 };
    return <RNSVGLine ref={this.refMethod} {...lineProps} />;
  }
}

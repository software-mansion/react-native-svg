import * as React from 'react';
import { extract, stringifyPropsForFabric } from '../lib/extract/extractProps';
import type { CommonPathProps, NumberProp } from '../lib/extract/types';
import Shape from './Shape';
import RNSVGCircle from '../fabric/CircleNativeComponent';
import type { NativeMethods } from 'react-native';

export interface CircleProps extends CommonPathProps {
  cx?: NumberProp;
  cy?: NumberProp;
  opacity?: NumberProp;
  r?: NumberProp;
}

export default class Circle extends Shape<CircleProps> {
  static displayName = 'Circle';

  static defaultProps = {
    cx: 0,
    cy: 0,
    r: 0,
  };

  render() {
    const { props } = this;
    const { cx, cy, r } = props;
    const circleProps = {
      ...extract(this, props),
      ...stringifyPropsForFabric({ cx, cy, r }),
    };

    return (
      <RNSVGCircle
        ref={(ref) => this.refMethod(ref as (Circle & NativeMethods) | null)}
        {...circleProps}
      />
    );
  }
}

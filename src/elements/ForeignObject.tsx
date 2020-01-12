import React from 'react';
import { requireNativeComponent } from 'react-native';
import { withoutXY } from '../lib/extract/extractProps';
import { NumberProp } from '../lib/extract/types';
import G from './G';

export default class ForeignObject extends G<{
  x?: NumberProp;
  y?: NumberProp;
  width?: NumberProp;
  height?: NumberProp;
}> {
  static displayName = 'ForeignObject';

  static defaultProps = {
    x: '0%',
    y: '0%',
    width: '100%',
    height: '100%',
  };

  render() {
    const { props } = this;
    const { x, y, width, height, children } = props;
    return (
      <RNSVGForeignObject
        ref={this.refMethod}
        {...withoutXY(this, props)}
        x={x}
        y={y}
        width={width}
        height={height}
      >
        {children}
      </RNSVGForeignObject>
    );
  }
}

export const RNSVGForeignObject = requireNativeComponent('RNSVGForeignObject');

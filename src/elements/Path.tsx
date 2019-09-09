import React from 'react';
import { requireNativeComponent } from 'react-native';
import extractProps, { propsAndStyles } from '../lib/extract/extractProps';
import Shape from './Shape';

export default class Path extends Shape<{
  d?: string;
}> {
  static displayName = 'Path';

  render() {
    const { props } = this;
    return (
      <RNSVGPath
        ref={this.refMethod}
        {...extractProps(propsAndStyles(props), this)}
        d={props.d}
      />
    );
  }
}

export const RNSVGPath = requireNativeComponent('RNSVGPath');

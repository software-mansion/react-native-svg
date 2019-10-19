import React from 'react';
import { requireNativeComponent } from 'react-native';
import extractProps, { propsAndStyles } from '../lib/extract/extractProps';
import Shape from './Shape';

export default class ClipPath extends Shape<{}> {
  static displayName = 'ClipPath';

  render() {
    const { props } = this;
    return (
      <RNSVGClipPath
        ref={this.refMethod}
        {...extractProps(propsAndStyles(props), this)}
      >
        {props.children}
      </RNSVGClipPath>
    );
  }
}

export const RNSVGClipPath = requireNativeComponent('RNSVGClipPath');

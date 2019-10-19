import React from 'react';
import { requireNativeComponent } from 'react-native';
import extractClipPath from '../lib/extract/extractClipPath';
import { TransformProps } from '../lib/extract/types';
import Shape from './Shape';

export default class ClipPath extends Shape<{
  id?: string;
  clipPath?: string;
  clipRule?: 'evenodd' | 'nonzero';
  transform?: number[] | string | TransformProps;
}> {
  static displayName = 'ClipPath';

  render() {
    const { props } = this;
    const { id, children } = props;
    return (
      <RNSVGClipPath ref={this.refMethod} name={id} {...extractClipPath(props)}>
        {children}
      </RNSVGClipPath>
    );
  }
}

export const RNSVGClipPath = requireNativeComponent('RNSVGClipPath');

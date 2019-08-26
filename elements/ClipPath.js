import React from 'react';
import { requireNativeComponent } from 'react-native';
import extractClipPath from '../lib/extract/extractClipPath';
import Shape from './Shape';

export default class ClipPath extends Shape {
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

const RNSVGClipPath = requireNativeComponent('RNSVGClipPath');

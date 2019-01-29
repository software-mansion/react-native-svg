import React from 'react';
import { requireNativeComponent } from 'react-native';
import extractClipPath from '../lib/extract/extractClipPath';
import Shape from './Shape';

export default class ClipPath extends Shape {
  static displayName = 'ClipPath';

  render() {
    const { id, children } = this.props;
    return (
      <RNSVGClipPath
        ref={this.refMethod}
        name={id}
        {...extractClipPath(this.props)}
      >
        {children}
      </RNSVGClipPath>
    );
  }
}

const RNSVGClipPath = requireNativeComponent('RNSVGClipPath');

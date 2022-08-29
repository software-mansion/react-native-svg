import React, { ReactNode } from 'react';
import { extract } from '../lib/extract/extractProps';
import Shape from './Shape';
import { RNSVGClipPath } from '../ReactNativeSVG';

export interface ClipPathProps {
  children?: ReactNode;
  id?: string;
}

export default class ClipPath extends Shape<ClipPathProps> {
  static displayName = 'ClipPath';

  render() {
    const { props } = this;
    return (
      <RNSVGClipPath ref={this.refMethod} {...extract(this, props)}>
        {props.children}
      </RNSVGClipPath>
    );
  }
}

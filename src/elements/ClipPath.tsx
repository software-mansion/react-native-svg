import type { ReactNode } from 'react';
import * as React from 'react';
import RNSVGClipPath from '../fabric/ClipPathNativeComponent';
import { extract } from '../lib/extract/extractProps';
import Shape from './Shape';

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

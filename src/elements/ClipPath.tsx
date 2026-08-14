import type { ReactNode } from 'react';
import * as React from 'react';
import { extract } from '../lib/extract/extractProps';
import Shape from './Shape';
import RNSVGClipPath from '../fabric/ClipPathNativeComponent';
import { extractTransformSvgView } from '../lib/extract/extractTransform';

export interface ClipPathProps {
  children?: ReactNode;
  id?: string;
}

export default class ClipPath extends Shape<ClipPathProps> {
  static displayName = 'ClipPath';

  render() {
    const { props } = this;
    const extractedProps = extract(this, props);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transform = extractTransformSvgView(props as any);

    return (
      <RNSVGClipPath
        ref={this.refMethod}
        {...extractedProps}
        style={{ transform }}>
        {props.children}
      </RNSVGClipPath>
    );
  }
}

import React from 'react';
import { extract } from '../lib/extract/extractProps';
import Shape from './Shape';
import RNSVGPath from '../fabric/PathNativeComponent';
import type { CommonPathProps, NumberProp } from '../lib/extract/types';
import type { NativeMethods } from 'react-native';

export interface PathProps extends CommonPathProps {
  d?: string;
  opacity?: NumberProp;
}

export default class Path extends Shape<PathProps> {
  static displayName = 'Path';

  render() {
    const { props } = this;
    const { d } = props;
    const pathProps = { ...extract(this, props), d };

    return (
      <RNSVGPath
        ref={(ref) => this.refMethod(ref as (Path & NativeMethods) | null)}
        {...pathProps}
      />
    );
  }
}

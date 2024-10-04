import * as React from 'react';
import type { NativeMethods } from 'react-native';
import RNSVGPath from '../fabric/PathNativeComponent';
import { extract } from '../lib/extract/extractProps';
import type { CommonPathProps, NumberProp } from '../lib/extract/types';
import Shape from './Shape';

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

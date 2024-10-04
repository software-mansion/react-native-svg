import type { ReactNode } from 'react';
import * as React from 'react';
import type { NativeMethods } from 'react-native';
import RNSVGSymbol from '../fabric/SymbolNativeComponent';
import extractViewBox from '../lib/extract/extractViewBox';
import type { NumberProp } from '../lib/extract/types';
import Shape from './Shape';

export interface SymbolProps {
  children?: ReactNode;
  id?: string;
  viewBox?: string;
  preserveAspectRatio?: string;
  opacity?: NumberProp;
}

export default class Symbol extends Shape<SymbolProps> {
  static displayName = 'Symbol';

  render() {
    const { props } = this;
    const { id, children } = props;
    const symbolProps = { name: id };
    return (
      <RNSVGSymbol
        ref={(ref) => this.refMethod(ref as Shape<SymbolProps> & NativeMethods)}
        {...symbolProps}
        {...extractViewBox(props)}>
        {children}
      </RNSVGSymbol>
    );
  }
}

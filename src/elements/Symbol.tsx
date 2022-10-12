import React, { ReactNode } from 'react';
import extractViewBox from '../lib/extract/extractViewBox';
import Shape from './Shape';
import { RNSVGSymbol } from '../ReactNativeSVG';
import { NumberProp } from '../lib/extract/types';
import { NativeMethods } from 'react-native';

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
        ref={(ref) => this.refMethod(ref as (Symbol & NativeMethods) | null)}
        {...symbolProps}
        {...extractViewBox(props)}
      >
        {children}
      </RNSVGSymbol>
    );
  }
}

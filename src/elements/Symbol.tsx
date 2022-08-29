import React, { ReactNode } from 'react';
import extractViewBox from '../lib/extract/extractViewBox';
import Shape from './Shape';
import { RNSVGSymbol } from '../ReactNativeSVG';
import { NumberProp } from '../lib/extract/types';

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
        // @ts-ignore TODO: handle ref correctly
        ref={this.refMethod}
        {...symbolProps}
        {...extractViewBox(props)}
      >
        {children}
      </RNSVGSymbol>
    );
  }
}

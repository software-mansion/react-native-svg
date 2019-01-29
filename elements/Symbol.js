import React from 'react';
import { requireNativeComponent } from 'react-native';
import extractViewBox from '../lib/extract/extractViewBox';
import Shape from './Shape';

export default class Symbol extends Shape {
  static displayName = 'Symbol';

  render() {
    const { props } = this;
    const { id, children } = props;
    return (
      <RNSVGSymbol name={id} {...extractViewBox(props)}>
        {children}
      </RNSVGSymbol>
    );
  }
}

const RNSVGSymbol = requireNativeComponent('RNSVGSymbol');

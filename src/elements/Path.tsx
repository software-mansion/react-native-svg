import React from 'react';
import Shape from './Shape';
import { RNSVGPath } from './NativeComponents';

export default class Path extends Shape<{
  d?: string;
}> {
  static displayName = 'Path';

  render() {
    const { props } = this;
    const { d } = props;
    const pathProps = { d };
    return (
      <RNSVGPath ref={this.refMethod} {...pathProps}  />
    );
  }
}

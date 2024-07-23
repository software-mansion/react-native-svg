import * as React from 'react';
import { Component } from 'react';
import RNSVGDefs from '../fabric/DefsNativeComponent';

export default class Defs extends Component<React.PropsWithChildren> {
  static displayName = 'Defs';

  render() {
    return <RNSVGDefs>{this.props.children}</RNSVGDefs>;
  }
}

import React, { Component } from 'react';
import { RNSVGDefs } from '../ReactNativeSVG';

export default class Defs extends Component<React.PropsWithChildren<{}>> {
  static displayName = 'Defs';

  render() {
    return <RNSVGDefs>{this.props.children}</RNSVGDefs>;
  }
}

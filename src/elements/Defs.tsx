import React, { Component } from 'react';
import { requireNativeComponent } from 'react-native';

export default class Defs extends Component {
  static displayName = 'Defs';

  render() {
    return <RNSVGDefs>{this.props.children}</RNSVGDefs>;
  }
}

export const RNSVGDefs = requireNativeComponent('RNSVGDefs');

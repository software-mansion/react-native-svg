import * as React from 'react';
import { requireNativeComponent } from 'react-native';
import { RNSVGDefs } from './NativeComponents';

export default class Defs extends React.Component {
  static displayName = 'Defs';

  render() {
    return <RNSVGDefs>{this.props.children}</RNSVGDefs>;
  }
}

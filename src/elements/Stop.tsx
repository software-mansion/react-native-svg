import { Component } from 'react';
import { Color, NumberProp } from '../lib/extract/types';

export interface StopProps {
  stopColor?: Color;
  stopOpacity?: NumberProp;
  offset?: NumberProp;
  parent?: Component;
}

export default class Stop extends Component<StopProps, {}> {
  static displayName = 'Stop';

  setNativeProps = () => {
    const { parent } = this.props;
    if (parent) {
      parent.forceUpdate();
    }
  };

  render() {
    return null;
  }
}

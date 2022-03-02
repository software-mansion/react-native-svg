import { Component } from 'react';
import { StopProps } from './types';

export default class Stop extends Component<
  StopProps & { parent?: Component },
  {}
> {
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

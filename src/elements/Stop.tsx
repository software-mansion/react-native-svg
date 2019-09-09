import { Component } from 'react';

type StopProps = {
  parent?: Component;
};

export default class Stop extends Component<StopProps, {}> {
  props!: StopProps;
  static displayName = 'Stop';

  static defaultProps = {
    stopColor: '#000',
    stopOpacity: 1,
  };
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

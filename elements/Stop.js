import { Component } from 'react';

export default class Stop extends Component {
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

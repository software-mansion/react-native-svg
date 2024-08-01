import { Component } from 'react';
import { NumberProp } from '../../lib/extract/types';
import { warnUnimplementedFilter } from '../../lib/util';

export interface FePointLightProps {
  x?: NumberProp;
  y?: NumberProp;
  z?: NumberProp;
}

export default class FePointLight extends Component<FePointLightProps> {
  static displayName = 'FePointLight';

  static defaultProps = {};

  render() {
    warnUnimplementedFilter();
    return null;
  }
}

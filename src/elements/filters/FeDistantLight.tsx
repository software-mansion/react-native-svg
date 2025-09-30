import { Component } from 'react';
import { NumberProp } from '../../lib/extract/types';
import { warnUnimplementedFilter } from '../../lib/util';

export interface FeDistantLightProps {
  azimuth?: NumberProp;
  elevation?: NumberProp;
}

export default class FeDistantLight extends Component<FeDistantLightProps> {
  static displayName = 'FeDistantLight';

  static defaultProps = {};

  render() {
    warnUnimplementedFilter();
    return null;
  }
}

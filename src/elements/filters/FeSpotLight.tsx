import { Component } from 'react';
import { NumberProp } from '../../lib/extract/types';
import { warnUnimplementedFilter } from '../../lib/util';

export interface FeSpotLightProps {
  x?: NumberProp;
  y?: NumberProp;
  z?: NumberProp;
  pointsAtX?: NumberProp;
  pointsAtY?: NumberProp;
  pointsAtZ?: NumberProp;
  specularExponent?: NumberProp;
  limitingConeAngle?: NumberProp;
}

export default class FeSpotLight extends Component<FeSpotLightProps> {
  static displayName = 'FeSpotLight';

  static defaultProps = {};

  render() {
    warnUnimplementedFilter();
    return null;
  }
}

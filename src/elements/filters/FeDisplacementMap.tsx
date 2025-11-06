import { NumberProp } from '../../lib/extract/types';
import { warnUnimplementedFilter } from '../../lib/util';
import FilterPrimitive from './FilterPrimitive';
import { ChannelSelector } from './types';

export interface FeDisplacementMapProps {
  in?: string;
  in2?: string;
  scale?: NumberProp;
  xChannelSelector?: ChannelSelector;
  yChannelSelector?: ChannelSelector;
}

export default class FeDisplacementMap extends FilterPrimitive<FeDisplacementMapProps> {
  static displayName = 'FeDisplacementMap';

  static defaultProps = {
    ...this.defaultPrimitiveProps,
  };

  render() {
    warnUnimplementedFilter();
    return null;
  }
}

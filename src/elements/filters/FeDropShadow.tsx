import { NumberArray, NumberProp } from '../../lib/extract/types';
import { warnUnimplementedFilter } from '../../lib/util';
import FilterPrimitive from './FilterPrimitive';

export interface FeDropShadowProps {
  in?: string;
  stdDeviation?: NumberArray;
  dx?: NumberProp;
  dy?: NumberProp;
}

export default class FeDropShadow extends FilterPrimitive<FeDropShadowProps> {
  static displayName = 'FeDropShadow';

  static defaultProps = {
    ...this.defaultPrimitiveProps,
  };

  render() {
    warnUnimplementedFilter();
    return null;
  }
}

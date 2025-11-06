import { NumberArray } from '../../lib/extract/types';
import { warnUnimplementedFilter } from '../../lib/util';
import FilterPrimitive from './FilterPrimitive';

export interface FeMorphologyProps {
  in?: string;
  operator?: 'erode' | 'dilate';
  radius?: NumberArray;
}

export default class FeMorphology extends FilterPrimitive<FeMorphologyProps> {
  static displayName = 'FeMorphology';

  static defaultProps = {
    ...this.defaultPrimitiveProps,
  };

  render() {
    warnUnimplementedFilter();
    return null;
  }
}

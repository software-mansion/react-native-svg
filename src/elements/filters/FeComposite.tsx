import { NumberProp } from '../../lib/extract/types';
import { warnUnimplementedFilter } from '../../lib/util';
import FilterPrimitive from './FilterPrimitive';

type FeCompositeOperator =
  | 'over'
  | 'in'
  | 'out'
  | 'atop'
  | 'xor'
  | 'arithmetic';

export interface FeCompositeProps {
  in?: string;
  in2?: string;
  operator?: FeCompositeOperator;
  k1?: NumberProp;
  k2?: NumberProp;
  k3?: NumberProp;
  k4?: NumberProp;
}

export default class FeComposite extends FilterPrimitive<FeCompositeProps> {
  static displayName = 'FeComposite';

  static defaultProps = {
    ...this.defaultPrimitiveProps,
  };

  render() {
    warnUnimplementedFilter();
    return null;
  }
}

import { BooleanProp, NumberArray, NumberProp } from '../../lib/extract/types';
import { warnUnimplementedFilter } from '../../lib/util';
import FilterPrimitive from './FilterPrimitive';
import { EdgeMode } from './types';

export interface FeConvolveMatrixProps {
  in?: string;
  order?: NumberArray;
  kernelMatrix?: NumberArray;
  divisor?: NumberProp;
  bias?: NumberProp;
  targetX?: NumberProp;
  targetY?: NumberProp;
  edgeMode?: EdgeMode;
  kernelUnitLength?: NumberArray;
  preserveAlpha?: BooleanProp;
}

export default class FeConvolveMatrix extends FilterPrimitive<FeConvolveMatrixProps> {
  static displayName = 'FeConvolveMatrix';

  static defaultProps = {
    ...this.defaultPrimitiveProps,
  };

  render() {
    warnUnimplementedFilter();
    return null;
  }
}

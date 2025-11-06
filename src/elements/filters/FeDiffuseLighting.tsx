import { NumberArray, NumberProp } from '../../lib/extract/types';
import { warnUnimplementedFilter } from '../../lib/util';
import FilterPrimitive from './FilterPrimitive';

export interface FeDiffuseLightingProps {
  in?: string;
  surfaceScale?: NumberProp;
  diffuseConstant?: NumberProp;
  kernelUnitLength?: NumberArray;
}

export default class FeDiffuseLighting extends FilterPrimitive<FeDiffuseLightingProps> {
  static displayName = 'FeDiffuseLighting';

  static defaultProps = {
    ...this.defaultPrimitiveProps,
  };

  render() {
    warnUnimplementedFilter();
    return null;
  }
}

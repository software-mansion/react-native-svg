import { NumberArray, NumberProp } from '../../lib/extract/types';
import { warnUnimplementedFilter } from '../../lib/util';
import FilterPrimitive from './FilterPrimitive';

export interface FeSpecularLightingProps {
  in?: string;
  surfaceScale?: NumberProp;
  specularConstant?: NumberProp;
  specularExponent?: NumberProp;
  kernelUnitLength?: NumberArray;
}

export default class FeSpecularLighting extends FilterPrimitive<FeSpecularLightingProps> {
  static displayName = 'FeSpecularLighting';

  static defaultProps = {
    ...this.defaultPrimitiveProps,
  };

  render() {
    warnUnimplementedFilter();
    return null;
  }
}

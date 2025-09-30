import { NumberArray, NumberProp } from '../../lib/extract/types';
import { warnUnimplementedFilter } from '../../lib/util';
import FilterPrimitive from './FilterPrimitive';

export interface FeTurbulenceProps {
  baseFrequency?: NumberArray;
  numOctaves?: NumberProp;
  seed?: NumberProp;
  stitchTiles?: 'stitch' | 'noStitch';
  type?: 'fractalNoise' | 'turbulence';
}

export default class FeTurbulence extends FilterPrimitive<FeTurbulenceProps> {
  static displayName = 'FeTurbulence';

  static defaultProps = {
    ...this.defaultPrimitiveProps,
  };

  render() {
    warnUnimplementedFilter();
    return null;
  }
}

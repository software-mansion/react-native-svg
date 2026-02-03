import { RNSVGFeTurbulence } from '../../fabric';
import { NumberArray, NumberProp } from '../../lib/extract/types';
import FilterPrimitive from './FilterPrimitive';
import { NativeMethods } from 'react-native';
import {
  extractFeTurbulence,
  extractFilter,
} from '../../lib/extract/extractFilter';

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
    baseFrequency: 0,
    numOctaves: 1,
    seed: 0,
    stitchTiles: 'noStitch',
    type: 'turbulence',
  };

  render() {
    return (
      <RNSVGFeTurbulence
        ref={(ref) =>
          this.refMethod(ref as (FeTurbulence & NativeMethods) | null)
        }
        {...this.props}
        {...extractFilter(this.props)}
        {...extractFeTurbulence(this.props)}
      />
    );
  }
}

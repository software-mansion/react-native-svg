import { NativeMethods } from 'react-native';
import { RNSVGFeConvolveMatrix } from '../../fabric';
import { BooleanProp, NumberArray, NumberProp } from '../../lib/extract/types';
import FilterPrimitive from './FilterPrimitive';
import { EdgeMode } from './types';
import {
  extractFeConvolveMatrix,
  extractFilter,
  extractIn,
} from '../../lib/extract/extractFilter';

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
    edgeMode: 'duplicate',
    preserveAlpha: false,
    bias: 0,
  };

  render() {
    return (
      <RNSVGFeConvolveMatrix
        ref={(ref) =>
          this.refMethod(ref as (FeConvolveMatrix & NativeMethods) | null)
        }
        {...extractFilter(this.props)}
        {...extractIn(this.props)}
        {...extractFeConvolveMatrix(this.props)}
      />
    );
  }
}

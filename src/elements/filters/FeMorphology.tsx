import { NumberArray } from '../../lib/extract/types';
import RNSVGFeMorphology from '../../fabric/FeMorphologyNativeComponent';
import FilterPrimitive from './FilterPrimitive';
import {
  extractFeMorphology,
  extractFilter,
  extractIn,
} from '../../lib/extract/extractFilter';
import { NativeMethods } from 'react-native';

type Operator = 'erode' | 'dilate';

export interface FeMorphologyProps {
  in?: string;
  operator?: Operator;
  radius?: NumberArray;
}

export default class FeMorphology extends FilterPrimitive<FeMorphologyProps> {
  static displayName = 'FeMorphology';

  static defaultProps = {
    ...this.defaultPrimitiveProps,
  };

  render() {
    return (
      <RNSVGFeMorphology
        ref={(ref) =>
          this.refMethod(ref as (FeMorphology & NativeMethods) | null)
        }
        {...extractFilter(this.props)}
        {...extractIn(this.props)}
        {...extractFeMorphology(this.props)}
      />
    );
  }
}

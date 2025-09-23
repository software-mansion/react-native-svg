import { NumberProp } from '../../lib/extract/types';
import RNSVGFeDisplacementMap from '../../fabric/FeDisplacementMapNativeComponent';
import FilterPrimitive from './FilterPrimitive';
import { ChannelSelector } from './types';
import { NativeMethods } from 'react-native';
import {
  extractFeDisplacementMap,
  extractFilter,
  extractIn,
} from '../../lib/extract/extractFilter';

export interface FeDisplacementMapProps {
  in?: string;
  in2?: string;
  scale?: NumberProp;
  xChannelSelector?: ChannelSelector;
  yChannelSelector?: ChannelSelector;
}

export default class FeDisplacementMap extends FilterPrimitive<FeDisplacementMapProps> {
  static displayName = 'FeDisplacementMap';

  static defaultProps = {
    ...this.defaultPrimitiveProps,
    scale: 0,
    xChannelSelector: 'A',
    yChannelSelector: 'A',
  };

  render() {
    return (
      <RNSVGFeDisplacementMap
        ref={(ref) =>
          this.refMethod(ref as (FeDisplacementMap & NativeMethods) | null)
        }
        {...extractFilter(this.props)}
        {...extractIn(this.props)}
        {...extractFeDisplacementMap(this.props)}
      />
    );
  }
}

import { ColorValue } from 'react-native';
import { NumberProp } from '../../lib/extract/types';
import { warnUnimplementedFilter } from '../../lib/util';
import FilterPrimitive from './FilterPrimitive';

export interface FeFloodProps {
  in?: string;
  floodColor?: ColorValue;
  floodOpacity?: NumberProp;
}

export default class FeFlood extends FilterPrimitive<FeFloodProps> {
  static displayName = 'FeFlood';

  static defaultProps = {
    ...this.defaultPrimitiveProps,
  };

  render() {
    warnUnimplementedFilter();
    return null;
  }
}

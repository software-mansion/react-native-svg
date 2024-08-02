import { warnUnimplementedFilter } from '../../lib/util';
import FilterPrimitive from './FilterPrimitive';

export interface FeTileProps {
  in?: string;
}

export default class FeTile extends FilterPrimitive<FeTileProps> {
  static displayName = 'FeTile';

  static defaultProps = {
    ...this.defaultPrimitiveProps,
  };

  render() {
    warnUnimplementedFilter();
    return null;
  }
}

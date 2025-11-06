import { warnUnimplementedFilter } from '../../lib/util';
import FilterPrimitive from './FilterPrimitive';

export interface FeImageProps {
  href?: string;
  preserveAspectRatio?: string;
  crossOrigin?: 'anonymous' | 'use-credentials' | '';
}

export default class FeImage extends FilterPrimitive<FeImageProps> {
  static displayName = 'FeImage';

  static defaultProps = {
    ...this.defaultPrimitiveProps,
  };

  render() {
    warnUnimplementedFilter();
    return null;
  }
}

import { warnUnimplementedFilter } from '../../lib/util';
import FilterPrimitive from './FilterPrimitive';

type BlendMode = 'normal' | 'multiply' | 'screen' | 'darken' | 'lighten';

export interface FeBlendProps {
  in?: string;
  in2?: string;
  mode?: BlendMode;
}

export default class FeBlend extends FilterPrimitive<FeBlendProps> {
  static displayName = 'FeBlend';

  static defaultProps = {
    ...this.defaultPrimitiveProps,
  };

  render() {
    warnUnimplementedFilter();
    return null;
  }
}

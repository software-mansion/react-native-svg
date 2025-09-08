import { extractFilter, extractIn } from '../../lib/extract/extractFilter';
import FilterPrimitive from './FilterPrimitive';
import RNSVGFeTile from '../../fabric/FeTileNativeComponent';
import { NativeMethods } from 'react-native';

export interface FeTileProps {
  in?: string;
}

export default class FeTile extends FilterPrimitive<FeTileProps> {
  static displayName = 'FeTile';

  static defaultProps = {
    ...this.defaultPrimitiveProps,
  };

  render() {
    return (
      <RNSVGFeTile
        ref={(ref) => this.refMethod(ref as (FeTile & NativeMethods) | null)}
        {...extractFilter(this.props)}
        {...extractIn(this.props)}
      />
    );
  }
}

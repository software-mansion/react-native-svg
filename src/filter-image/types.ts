import { FilterPrimitiveCommonProps } from '../elements/filters/FilterPrimitive';
import { FeColorMatrixProps, FeOffsetProps } from '../index';

export type FilterElement = (
  | ({ name: 'feColorMatrix' } & FeColorMatrixProps)
  | ({ name: 'feOffset' } & FeOffsetProps)
) &
  FilterPrimitiveCommonProps;

export type Filters = Array<FilterElement>;

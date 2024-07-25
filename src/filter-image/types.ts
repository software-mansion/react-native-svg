import { FilterPrimitiveCommonProps } from '../elements/filters/FilterPrimitive';
import { FeColorMatrixProps } from '../index';

export type FilterElement = ({ name: 'feColorMatrix' } & FeColorMatrixProps) &
  FilterPrimitiveCommonProps;

export type Filters = Array<FilterElement>;

import { FilterPrimitiveCommonProps } from '../elements/filters/FilterPrimitive';
import { FeColorMatrixProps, FeGaussianBlurProps } from '../index';

export type FilterElement = (
  | ({ name: 'feColorMatrix' } & FeColorMatrixProps)
  | ({ name: 'feGaussianBlur' } & FeGaussianBlurProps)
) &
  FilterPrimitiveCommonProps;

export type Filters = Array<FilterElement>;

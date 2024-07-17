import { FilterPrimitiveCommonProps } from '../elements/filters/FilterPrimitive';
import { FeColorMatrixProps, FeGaussianBlurProps } from '../index';

export type FilterElement = (
  | ({ name: 'colorMatrix' } & FeColorMatrixProps)
  | ({ name: 'gaussianBlur' } & FeGaussianBlurProps)
) &
  FilterPrimitiveCommonProps;

export type Filters = Array<FilterElement>;

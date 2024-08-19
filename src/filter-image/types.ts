import { FilterPrimitiveCommonProps } from '../elements/filters/FilterPrimitive';
import {
  FeColorMatrixProps,
  FeGaussianBlurProps,
  FeOffsetProps,
} from '../index';

export type FilterElement = (
  | ({ name: 'feColorMatrix' } & FeColorMatrixProps)
  | ({ name: 'feGaussianBlur' } & FeGaussianBlurProps)
  | ({ name: 'feOffset' } & FeOffsetProps)
) &
  FilterPrimitiveCommonProps;

export type Filters = Array<FilterElement>;

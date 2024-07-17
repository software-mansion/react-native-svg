import { FilterPrimitiveCommonProps } from '../elements/filters/FilterPrimitive';
import {
  FeColorMatrixProps,
  FeGaussianBlurProps,
  FeOffsetProps,
} from '../index';

export type FilterElement = (
  | ({ name: 'colorMatrix' } & FeColorMatrixProps)
  | ({ name: 'gaussianBlur' } & FeGaussianBlurProps)
  | ({ name: 'offset' } & FeOffsetProps)
) &
  FilterPrimitiveCommonProps;

export type Filters = Array<FilterElement>;

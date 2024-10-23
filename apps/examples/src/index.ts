import {examples} from './examples';
import * as Filters from './examples/Filters';
import * as FilterImage from './examples/FilterImage';

export const allScreens = {
  ...examples,
  ...Filters.samples,
  ...FilterImage.samples,
};

export const allScreensKeys = Object.keys(
  allScreens,
) as (keyof typeof allScreens)[];

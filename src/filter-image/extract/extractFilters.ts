import React from 'react';
import { tags } from '../../xmlTags';
import { FilterElement, Filters } from '../types';
import { parse } from './extractFiltersString';

export const extractFiltersCss = (rawFilters?: Filters | string): Filters => {
  if (!rawFilters) {
    return [];
  }
  if (Array.isArray(rawFilters)) {
    return rawFilters as Filters;
  }
  return parse(rawFilters);
};

export const mapFilterToComponent = (
  { name, ...props }: FilterElement,
  index: number
) => {
  return tags[name]
    ? React.createElement(tags[name], {
        ...props,
        key: name + index,
      })
    : null;
};

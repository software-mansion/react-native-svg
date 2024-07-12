import React, { useMemo } from 'react';
import {
  ImageProps,
  Platform,
  Image as RNImage,
  StyleSheet,
  View,
} from 'react-native';
import { FeColorMatrix, Filter, Image, Svg } from '../index';
import { Filters } from './types';
import { extractResizeMode } from './extractImage';

export interface FilterImageProps extends ImageProps {
  filters: Filters;
}

const getFilters = (filters: Filters) => {
  return filters?.map((filter, index) => {
    const { name, ...filterProps } = filter;
    switch (name) {
      case 'colorMatrix':
        return <FeColorMatrix key={`${filter}-${index}`} {...filterProps} />;
      default:
        return null;
    }
  });
};

const getFilterName = (filter: Filters) => {
  return (
    'filter' +
    filter.reduce(
      (acc, curr) =>
        acc +
        curr.name +
        (Array.isArray(curr.values) ? curr.values.join(',') : curr.values) +
        ';',
      ''
    )
  );
};

export const FilterImage = (props: FilterImageProps) => {
  const { source, style, ...imageProps } = props;
  const hasFilter = props.filters.length > 0;
  const filterId = useMemo(() => getFilterName(props.filters), [props.filters]);

  // FIXME: resolveAssetSource is not available on web
  // We need to find a way to get the source asset and its dimensions
  const src =
    Platform.OS !== 'web' ? RNImage.resolveAssetSource(source) : undefined;
  const styles = StyleSheet.flatten(style);
  const width = props.width || styles?.width || src?.width;
  const height = props.height || styles?.height || src?.height;
  const preserveAspectRatio = extractResizeMode(props.resizeMode);

  return (
    <View
      style={[
        styles,
        {
          width,
          height,
          overflow: 'hidden',
        },
      ]}>
      <Svg width="100%" height="100%">
        {hasFilter && (
          <Filter id={filterId}>{getFilters(props.filters)}</Filter>
        )}
        <Image
          {...imageProps}
          href={props.src || props.source}
          width="100%"
          height="100%"
          preserveAspectRatio={preserveAspectRatio}
          filter={hasFilter ? `url(#${filterId})` : undefined}
        />
      </Svg>
    </View>
  );
};

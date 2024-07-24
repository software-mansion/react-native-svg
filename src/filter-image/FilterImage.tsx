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
import { resolveAssetUri } from '../lib/resolveAssetUri';
import { getRandomNumber } from '../lib/util';

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

export const FilterImage = (props: FilterImageProps) => {
  const { filters, source, style, ...imageProps } = props;
  const hasFilter = filters.length > 0;
  const filterId = useMemo(() => `RNSVG-${getRandomNumber()}`, []);

  const src =
    Platform.OS === 'web'
      ? resolveAssetUri(source)
      : RNImage.resolveAssetSource(source);
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

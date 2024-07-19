import { ImageProps, Image as RNImage, StyleSheet, View } from 'react-native';
import { FeColorMatrix, Filter, Image, Svg } from '../index';
import { Filters } from './types';
import { extractResizeMode } from './extractImage';

export interface FilterImageProps extends ImageProps {
  filters: Filters;
}

const getFilters = (filters: FilterImageProps['filters']) => {
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
  const { source, style, ...imageProps } = props;

  const src = RNImage.resolveAssetSource(source);
  const styles = StyleSheet.flatten(style);
  const width = props.width || styles?.width || src.width;
  const height = props.height || styles?.height || src.height;
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
        <Filter id={`filter`}>{getFilters(props.filters)}</Filter>
        <Image
          {...imageProps}
          href={props.src || props.source}
          width="100%"
          height="100%"
          preserveAspectRatio={preserveAspectRatio}
          filter={props.filters && 'url(#filter)'}
        />
      </Svg>
    </View>
  );
};

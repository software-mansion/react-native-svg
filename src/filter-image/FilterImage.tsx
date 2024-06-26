import { ImageProps, View, Image as RNImage, StyleSheet } from 'react-native';
import {
  Svg,
  FeColorMatrix,
  Filter,
  Image,
  FeColorMatrixProps,
} from '../index';
import { FilterPrimitiveStandardAttributes } from '../elements/filters/FilterPrimitive';

export interface FilterImageProps extends ImageProps {
  filters: Array<
    ({ name: 'colorMatrix' } & FeColorMatrixProps) &
      FilterPrimitiveStandardAttributes
  >;
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

  return (
    <View style={[styles, { width, height }]}>
      <Svg width="100%" height="100%">
        <Filter id={`filter`}>{getFilters(props.filters)}</Filter>
        <Image
          {...imageProps}
          href={props.src || props.source}
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
          filter={props.filters && 'url(#filter)'}
        />
      </Svg>
    </View>
  );
};

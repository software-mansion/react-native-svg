import * as React from 'react';
import {
  ImageProps,
  ImageStyle,
  Platform,
  Image as RNImage,
  StyleProp,
  StyleSheet,
  View,
} from 'react-native';
import { Filter, Image, Svg } from '../index';
import { resolveAssetUri } from '../lib/resolveAssetUri';
import { getRandomNumber } from '../lib/util';
import {
  extractFiltersCss,
  mapFilterToComponent,
} from './extract/extractFilters';
import { extractResizeMode } from './extract/extractImage';
import { Filters } from './types';

export interface FilterImageProps extends ImageProps {
  style?: StyleProp<ImageStyle & { filter?: string | Filters }> | undefined;
  filters?: Filters;
}

export const FilterImage = (props: FilterImageProps) => {
  const { filters = [], source, style, ...imageProps } = props;
  const { filter: stylesFilter, ...styles } = StyleSheet.flatten(style ?? {});
  const extractedFilters = [...filters, ...extractFiltersCss(stylesFilter)];
  const filterId = React.useMemo(() => `RNSVG-${getRandomNumber()}`, []);

  const src =
    Platform.OS === 'web'
      ? resolveAssetUri(source)
      : RNImage.resolveAssetSource(source);
  const width = props.width || styles?.width || src?.width;
  const height = props.height || styles?.height || src?.height;
  const preserveAspectRatio = extractResizeMode(props.resizeMode);

  return (
    <View style={[styles, { width, height, overflow: 'hidden' }]}>
      <Svg width="100%" height="100%">
        <Filter id={filterId}>
          {extractedFilters.map(mapFilterToComponent)}
        </Filter>
        <Image
          {...imageProps}
          href={props.src || props.source}
          width="100%"
          height="100%"
          preserveAspectRatio={preserveAspectRatio}
          filter={extractedFilters.length > 0 ? `url(#${filterId})` : undefined}
        />
      </Svg>
    </View>
  );
};

import {
  Image,
  type ImageResolvedAssetSource,
  type ImageSourcePropType,
  type ImageProps as RNImageProps,
} from 'react-native';

// On native, React Native resolves assets itself. The web implementation
// lives in resolveAssetUri.web.ts, so native bundles do not depend on
// @react-native/assets-registry, which react-native no longer ships (0.87+).
export function resolveAssetUri(
  source?: RNImageProps['source'] | string | number
): Partial<ImageResolvedAssetSource> | null {
  return Image.resolveAssetSource(source as ImageSourcePropType);
}

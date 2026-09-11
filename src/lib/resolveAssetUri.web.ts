import {
  ImageResolvedAssetSource,
  PixelRatio,
  type ImageProps as RNImageProps,
} from 'react-native';
// @ts-expect-error react-native/assets-registry doesn't export types.
import { getAssetByID } from '@react-native/assets-registry/registry';

export type PackagerAsset = {
  __packager_asset: boolean;
  fileSystemLocation: string;
  httpServerLocation: string;
  width?: number;
  height?: number;
  scales: Array<number>;
  hash: string;
  name: string;
  type: string;
};

const svgDataUriPattern = /^(data:image\/svg\+xml;utf8,)(.*)/;

// Based on that function: https://github.com/necolas/react-native-web/blob/54c14d64dabd175e8055e1dc92e9196c821f9b7d/packages/react-native-web/src/exports/Image/index.js#L118-L156
export function resolveAssetUri(
  source?: RNImageProps['source'] | string | number
): Partial<ImageResolvedAssetSource> | null {
  let src: Partial<ImageResolvedAssetSource> = {};
  if (typeof source === 'number') {
    // get the URI from the packager
    const asset: PackagerAsset | null = getAssetByID(source);
    if (asset == null) {
      throw new Error(
        `Image: asset with ID "${source}" could not be found. Please check the image source or packager.`
      );
    }
    src = {
      width: asset.width,
      height: asset.height,
      scale: asset.scales[0],
    };
    if (asset.scales.length > 1) {
      const preferredScale = PixelRatio.get();
      // Get the scale which is closest to the preferred scale
      src.scale = asset.scales.reduce((prev, curr) =>
        Math.abs(curr - preferredScale) < Math.abs(prev - preferredScale)
          ? curr
          : prev
      );
    }
    const scaleSuffix = src.scale !== 1 ? `@${src.scale}x` : '';
    src.uri = asset
      ? `${asset.httpServerLocation}/${asset.name}${scaleSuffix}.${asset.type}`
      : '';
  } else if (typeof source === 'string') {
    src.uri = source;
  } else if (
    source &&
    !Array.isArray(source) &&
    typeof source.uri === 'string'
  ) {
    src.uri = source.uri;
  }

  if (src.uri) {
    const match = src?.uri?.match(svgDataUriPattern);
    // inline SVG markup may contain characters (e.g., #, ") that need to be escaped
    if (match) {
      const [, prefix, svg] = match;
      const encodedSvg = encodeURIComponent(svg);
      src.uri = `${prefix}${encodedSvg}`;
      return src;
    }
  }
  return src;
}

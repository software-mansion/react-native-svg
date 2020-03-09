import React, { useState, useEffect } from 'react';
import { NativeModules, Platform } from 'react-native';
// @ts-ignore
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';

import { fetchText } from './xml';
import { SvgCss } from './css';

const { getRawResource } = NativeModules.RNSVGRenderableManager;

export function getUriFromSource(source?: string | number) {
  const resolvedAssetSource = resolveAssetSource(source);
  return resolvedAssetSource.uri;
}

export function loadLocalRawResourceDefault(source?: string | number) {
  const uri = getUriFromSource(source);
  return fetchText(uri);
}

export function isUriAnAndroidResourceIdentifier(uri?: string | number) {
  return typeof uri === 'string' && uri.indexOf('/') <= -1;
}

export async function loadAndroidRawResource(uri?: string | number) {
  try {
    return await getRawResource(uri);
  } catch (e) {
    console.error(
      'Error in RawResourceUtils while trying to natively load an Android raw resource: ',
      e,
    );
    return null;
  }
}

export function loadLocalRawResourceAndroid(source?: string | number) {
  const uri = getUriFromSource(source);
  if (isUriAnAndroidResourceIdentifier(uri)) {
    return loadAndroidRawResource(uri);
  } else {
    return fetchText(uri);
  }
}

export const loadLocalRawResource =
  Platform.OS !== 'android'
    ? loadLocalRawResourceDefault
    : loadLocalRawResourceAndroid;

export type LocalProps = { asset?: string | number; override?: Object };

export function LocalSvg(props: LocalProps) {
  const { asset, ...rest } = props;
  const [xml, setXml] = useState(null);
  useEffect(() => {
    loadLocalRawResource(asset).then(setXml);
  }, [asset]);
  return <SvgCss xml={xml} {...rest} />;
}

export default LocalSvg;

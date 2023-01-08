import React, { useState, useEffect, Component } from 'react';
import { Platform, Image, ImageSourcePropType } from 'react-native';

import { fetchText } from './xml';
import { SvgCss, SvgWithCss } from './css';
import { SvgProps } from './elements/Svg';
import type { Spec } from './fabric/NativeSvgRenderableModule';

export function getUriFromSource(source: ImageSourcePropType) {
  const resolvedAssetSource = Image.resolveAssetSource(source);
  return resolvedAssetSource.uri;
}

export function loadLocalRawResourceDefault(source: ImageSourcePropType) {
  const uri = getUriFromSource(source);
  return fetchText(uri);
}

export function isUriAnAndroidResourceIdentifier(uri?: string) {
  return typeof uri === 'string' && uri.indexOf('/') <= -1;
}

export async function loadAndroidRawResource(uri: string) {
  try {
    const RNSVGRenderableModule: Spec =
      require('./fabric/NativeSvgRenderableModule').default;
    return await RNSVGRenderableModule.getRawResource(uri);
  } catch (e) {
    console.error(
      'Error in RawResourceUtils while trying to natively load an Android raw resource: ',
      e,
    );
    return null;
  }
}

// copy from https://www.npmjs.com/package/data-uri-to-buffer
export function dataUriToXml(uri) {
  if (!/^data:/i.test(uri)) {
    throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
  }
  // strip newlines
  uri = uri.replace(/\r?\n/g, '');
  // split the URI up into the "metadata" and the "data" portions
  const firstComma = uri.indexOf(',');
  if (firstComma === -1 || firstComma <= 4) {
    throw new TypeError('malformed data: URI');
  }
  // remove the "data:" scheme and parse the metadata
  const meta = uri.substring(5, firstComma).split(';');
  let base64 = false;
  for (let i = 1; i < meta.length; i++) {
    if (meta[i] === 'base64') {
      base64 = true;
    }
  }

  // get the encoded data portion and decode URI-encoded chars
  const data = unescape(uri.substring(firstComma + 1));
  if (!base64) {
    return data;
  }
  return Base64.decode(data);
}

export function loadLocalRawResourceAndroid(source: ImageSourcePropType) {
  const uri = getUriFromSource(source);
  if (uri.startsWith('data:')) {
    return new Promise((resolve) => {
      resolve(dataUriToXml(uri));
    });
  }
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

export type LocalProps = SvgProps & {
  asset: ImageSourcePropType;
  override?: Object;
};
export type LocalState = { xml: string | null };

export function LocalSvg(props: LocalProps) {
  const { asset, ...rest } = props;
  const [xml, setXml] = useState<string | null>(null);
  useEffect(() => {
    loadLocalRawResource(asset).then(setXml);
  }, [asset]);
  return <SvgCss xml={xml} {...rest} />;
}

export class WithLocalSvg extends Component<LocalProps, LocalState> {
  state = { xml: null };
  componentDidMount() {
    this.load(this.props.asset);
  }
  componentDidUpdate(prevProps: { asset: ImageSourcePropType }) {
    const { asset } = this.props;
    if (asset !== prevProps.asset) {
      this.load(asset);
    }
  }
  async load(asset: ImageSourcePropType) {
    try {
      this.setState({ xml: asset ? await loadLocalRawResource(asset) : null });
    } catch (e) {
      console.error(e);
    }
  }
  render() {
    const {
      props,
      state: { xml },
    } = this;
    return <SvgWithCss xml={xml} override={props} />;
  }
}

export default LocalSvg;

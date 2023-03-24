import React from 'react';
import type { NativeMethods } from 'react-native';
import { Image } from 'react-native';
import RNSVGImage from '../fabric/ImageNativeComponent';
import {
  stringifyPropsForFabric,
  withoutXY
} from '../lib/extract/extractProps';
import { alignEnum, meetOrSliceTypes } from '../lib/extract/extractViewBox';
import type {
  CommonPathProps
} from '../lib/extract/types';
import Shape from './Shape';

const spacesRegExp = /\s+/;

export interface ImageProps extends CommonPathProps{
  transform?:string
}

export default class SvgImage extends Shape<ImageProps> {
  static displayName = 'Image';

  static defaultProps = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    preserveAspectRatio: 'xMidYMid meet',
  };

  render() {
    const { props } = this;
    const {
      preserveAspectRatio,
      x,
      y,
      width,
      height,
      xlinkHref,
      href = xlinkHref,
    } = props;
    const modes = preserveAspectRatio
      ? preserveAspectRatio.trim().split(spacesRegExp)
      : [];
    const align = modes[0];
    const meetOrSlice: 'meet' | 'slice' | 'none' | string | undefined =
      modes[1];
    const stringifiedImageProps = stringifyPropsForFabric({
      x,
      y,
      width,
      height,
    });
    const imageProps = {
      ...stringifiedImageProps,
      meetOrSlice: meetOrSliceTypes[meetOrSlice] || 0,
      align: alignEnum[align] || 'xMidYMid',
      src: !href
        ? null
        : Image.resolveAssetSource(
            typeof href === 'string' ? { uri: href } : href,
          ),
    };
    return (
      <RNSVGImage
        ref={(ref) => this.refMethod(ref as (SvgImage & NativeMethods) | null)}
        {...withoutXY(this, props)}
        {...imageProps}
      />
    );
  }
}

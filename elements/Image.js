import React from 'react';
import { Image, requireNativeComponent } from 'react-native';
import { meetOrSliceTypes, alignEnum } from '../lib/extract/extractViewBox';
import extractProps, { propsAndStyles } from '../lib/extract/extractProps';
import Shape from './Shape';

const spacesRegExp = /\s+/;

export default class SvgImage extends Shape {
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
    const modes = preserveAspectRatio.trim().split(spacesRegExp);
    return (
      <RNSVGImage
        ref={this.refMethod}
        {...extractProps({ ...propsAndStyles(props), x: null, y: null }, this)}
        x={x}
        y={y}
        width={width}
        height={height}
        meetOrSlice={meetOrSliceTypes[modes[1]] || 0}
        align={alignEnum[modes[0]] || 'xMidYMid'}
        src={Image.resolveAssetSource(
          typeof href === 'string' ? { uri: href } : href,
        )}
      />
    );
  }
}

const RNSVGImage = requireNativeComponent('RNSVGImage');

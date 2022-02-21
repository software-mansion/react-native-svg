import React, { Component } from 'react';
import { Image as NativeImage, View } from 'react-native';
import { Image as SvgImage } from '../Svg';

class WebImage extends NativeImage {
  constructor(props, context) {
    super(props, context);
    this._setImageRef = ref => {
      this._imageRef = ref;
      const attrs = ref && ref.attributes;
      const src = attrs && attrs.src;
      const uri = src && src.value;
      this.setState({ href: uri });
    };
    this.oldRender = this.render;
    this.render = () => {
      const uri = this.state && this.state.href;
      return (
        <>
          <View
            style={{
              visibility: 'hidden',
              position: 'absolute',
              width: 0,
              height: 0,
            }}>
            {this.oldRender()}
          </View>
          <SvgImage {...this.props} href={uri} />
        </>
      );
    };
  }
}

export default props => (
  <WebImage {...props} source={props.source || props.href} />
);

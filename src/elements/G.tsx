import React from 'react';
import { requireNativeComponent } from 'react-native';
import extractProps, { propsAndStyles } from '../lib/extract/extractProps';
import { extractFont } from '../lib/extract/extractText';
import extractTransform from '../lib/extract/extractTransform';
import { TransformProps } from '../lib/extract/types';
import Shape from './Shape';

export default class G<P> extends Shape<P> {
  static displayName = 'G';

  setNativeProps = (
    props: Object & {
      matrix?: number[];
    } & TransformProps,
  ) => {
    const matrix = !props.matrix && extractTransform(props);
    if (matrix) {
      props.matrix = matrix;
    }
    this.root && this.root.setNativeProps(props);
  };

  render() {
    const { props } = this;
    const prop = propsAndStyles(props);
    return (
      <RNSVGGroup
        ref={this.refMethod}
        {...extractProps(prop, this)}
        font={extractFont(prop)}
      >
        {props.children}
      </RNSVGGroup>
    );
  }
}

export const RNSVGGroup = requireNativeComponent('RNSVGGroup');

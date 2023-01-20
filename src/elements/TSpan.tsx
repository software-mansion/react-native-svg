import type { Component } from 'react';
import React from 'react';
import extractProps, { propsAndStyles } from '../lib/extract/extractProps';
import extractTransform from '../lib/extract/extractTransform';
import type { TextChild } from '../lib/extract/extractText';
import extractText, { setTSpan } from '../lib/extract/extractText';
import { pickNotNil } from '../lib/util';
import Shape from './Shape';
import type {
  ColumnMajorTransformMatrix,
  CommonPathProps,
  FontProps,
  NumberArray,
  NumberProp,
  TransformProps,
} from '../lib/extract/types';
import RNSVGTSpan from '../fabric/TSpanNativeComponent';

export interface TSpanProps extends CommonPathProps, FontProps {
  children?: TextChild;
  x?: NumberArray;
  y?: NumberArray;
  dx?: NumberArray;
  dy?: NumberArray;
  rotate?: NumberArray;
  inlineSize?: NumberProp;
}

export default class TSpan extends Shape<TSpanProps> {
  static displayName = 'TSpan';

  setNativeProps = (
    props: Object & {
      matrix?: ColumnMajorTransformMatrix;
      style?: [] | {};
    } & TransformProps,
  ) => {
    const matrix = !props.matrix && extractTransform(props);
    if (matrix) {
      props.matrix = matrix;
    }
    const prop = propsAndStyles(props);
    Object.assign(prop, pickNotNil(extractText(prop, false)));
    this.root && this.root.setNativeProps(prop);
  };

  render() {
    const prop = propsAndStyles(this.props);
    const props = extractProps(
      {
        ...prop,
        x: null,
        y: null,
      },
      this,
    );
    Object.assign(props, extractText(prop, false));
    props.ref = this.refMethod as (instance: Component | null) => void;
    return <RNSVGTSpan {...props} />;
  }
}

setTSpan(TSpan);

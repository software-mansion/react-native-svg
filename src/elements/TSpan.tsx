import type { Component } from 'react';
import * as React from 'react';
import extractProps, { propsAndStyles } from '../lib/extract/extractProps';
import extractTransform, {
  extractTransformSvgView,
} from '../lib/extract/extractTransform';
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
    props: TSpanProps & {
      matrix?: ColumnMajorTransformMatrix;
      style?: [] | unknown;
    }
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
    const extractedProps = extractProps(
      {
        ...prop,
        x: null,
        y: null,
      },
      this
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transform = extractTransformSvgView(this.props as any);
    Object.assign(extractedProps, extractText(prop, false));
    extractedProps.ref = this.refMethod as (instance: Component | null) => void;
    return <RNSVGTSpan {...extractedProps} style={{ transform }} />;
  }
}

setTSpan(TSpan);

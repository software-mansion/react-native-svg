import type { Component } from 'react';
import * as React from 'react';
import extractTransform from '../lib/extract/extractTransform';
import { withoutXY } from '../lib/extract/extractProps';
import type {
  ColumnMajorTransformMatrix,
  NumberProp,
  TextPathMethod,
  TextPathMidLine,
  TextPathSpacing,
  TextSpecificProps,
  TransformProps,
} from '../lib/extract/types';
import type { TextChild } from '../lib/extract/extractText';
import extractText from '../lib/extract/extractText';
import { idPattern, pickNotNil } from '../lib/util';
import Shape from './Shape';
import TSpan from './TSpan';
import RNSVGTextPath from '../fabric/TextPathNativeComponent';

export interface TextPathProps extends TextSpecificProps {
  children?: TextChild;
  xlinkHref?: string;
  href?: string;
  startOffset?: NumberProp;
  method?: TextPathMethod;
  spacing?: TextPathSpacing;
  midLine?: TextPathMidLine;
  side?: string;
}

export default class TextPath extends Shape<TextPathProps> {
  static displayName = 'TextPath';

  setNativeProps = (
    props: object & {
      matrix?: ColumnMajorTransformMatrix;
      style?: [] | unknown;
    } & TransformProps
  ) => {
    const matrix = !props.matrix && extractTransform(props);
    if (matrix) {
      props.matrix = matrix;
    }
    Object.assign(props, pickNotNil(extractText(props, true)));
    this.root && this.root.setNativeProps(props);
  };

  render() {
    const {
      children,
      xlinkHref,
      href = xlinkHref,
      startOffset = 0,
      method,
      spacing,
      side,
      alignmentBaseline,
      midLine,
      ...prop
    } = this.props;
    const matched = href && href.match(idPattern);
    const match = matched && matched[1];
    if (match) {
      const props = withoutXY(this, prop);
      Object.assign(
        props,
        extractText(
          {
            children,
          },
          true
        ),
        {
          href: match,
          startOffset,
          method,
          spacing,
          side,
          alignmentBaseline,
          midLine,
        }
      );
      props.ref = this.refMethod as (instance: Component | null) => void;
      return <RNSVGTextPath {...props} />;
    }

    console.warn(
      'Invalid `href` prop for `TextPath` element, expected a href like "#id", but got: "' +
        href +
        '"'
    );
    return (
      <TSpan ref={this.refMethod as (instance: Component | null) => void}>
        {children}
      </TSpan>
    );
  }
}

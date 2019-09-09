import extractFill from './extractFill';
import extractStroke from './extractStroke';
import { transformToMatrix, props2transform } from './extractTransform';
import extractClipPath from './extractClipPath';
import extractResponder from './extractResponder';
import extractOpacity from './extractOpacity';
import { idPattern } from '../util';
import {
  ClipProps,
  FillProps,
  NumberProp,
  ResponderProps,
  StrokeProps,
  TransformProps,
} from './types';
import { Component } from 'react';

export function propsAndStyles(props: Object & { style?: [] | {} }) {
  const { style } = props;
  return {
    ...(Array.isArray(style) ? Object.assign({}, ...style) : style),
    ...props,
  };
}

export default function extractProps(
  props: {
    id?: string;
    mask?: string;
    clipPath?: string;
    opacity?: NumberProp;
    onLayout?: () => void;
    transform?: number[] | string | TransformProps;
  } & TransformProps &
    ResponderProps &
    StrokeProps &
    FillProps &
    ClipProps,
  ref: Object,
) {
  const { opacity, onLayout, id, clipPath, mask, transform } = props;
  const styleProperties: string[] = [];
  const transformProps = props2transform(props);
  const matrix = transformToMatrix(transformProps, transform);
  const extracted: {
    name?: string;
    mask?: string;
    opacity: number;
    matrix: number[];
    propList: string[];
    onLayout?: () => void;
    ref?: (instance: Component | null) => void;
  } = {
    matrix,
    onLayout,
    ...transformProps,
    propList: styleProperties,
    opacity: extractOpacity(opacity),
    ...extractResponder(props, ref),
    ...extractFill(props, styleProperties),
    ...extractStroke(props, styleProperties),
  };

  if (id) {
    extracted.name = id;
  }

  if (clipPath) {
    Object.assign(extracted, extractClipPath(props));
  }

  if (mask) {
    const matched = mask.match(idPattern);

    if (matched) {
      extracted.mask = matched[1];
    } else {
      console.warn(
        'Invalid `mask` prop, expected a mask like "#id", but got: "' +
          mask +
          '"',
      );
    }
  }

  return extracted;
}

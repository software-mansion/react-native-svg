import React from 'react';
import { ColorValue, processColor } from 'react-native';
import { FeBlendProps as FeBlendComponentProps } from '../../elements/filters/FeBlend';
import { FeColorMatrixProps as FeColorMatrixComponentProps } from '../../elements/filters/FeColorMatrix';
import { FeFloodProps as FeFloodComponentProps } from '../../elements/filters/FeFlood';
import { FeGaussianBlurProps as FeGaussianBlurComponentProps } from '../../elements/filters/FeGaussianBlur';
import { FeMergeProps as FeMergeComponentProps } from '../../elements/filters/FeMerge';
import { NativeProps as FeBlendNativeProps } from '../../fabric/FeBlendNativeComponent';
import { NativeProps as FeColorMatrixNativeProps } from '../../fabric/FeColorMatrixNativeComponent';
import { NativeProps as FeFloodNativeProps } from '../../fabric/FeFloodNativeComponent';
import { NativeProps as FeGaussianBlurNativeProps } from '../../fabric/FeGaussianBlurNativeComponent';
import { NativeProps as FeMergeNativeProps } from '../../fabric/FeMergeNativeComponent';
import extractBrush from './extractBrush';
import extractOpacity from './extractOpacity';
import { NumberProp } from './types';

const spaceReg = /\s+/;

interface FilterPrimitiveCommonProps {
  x?: NumberProp;
  y?: NumberProp;
  width?: NumberProp;
  height?: NumberProp;
  result?: string;
}

export const extractFilter = (
  props: FilterPrimitiveCommonProps
): FilterPrimitiveCommonProps => {
  const { x, y, width, height, result } = props;
  const extracted: FilterPrimitiveCommonProps = {
    x,
    y,
    width,
    height,
    result,
  };

  return extracted;
};

export const extractIn = (props: { in?: string }) => {
  if (props.in) {
    return { in1: props.in };
  }
  return {};
};

export const extractFeBlend = (
  props: FeBlendComponentProps
): FeBlendNativeProps => {
  const extracted: FeBlendNativeProps = {};

  if (props.in2) {
    extracted.in2 = props.in2;
  }
  if (props.mode) {
    extracted.mode = props.mode;
  }

  return extracted;
};

export const extractFeColorMatrix = (
  props: FeColorMatrixComponentProps
): FeColorMatrixNativeProps => {
  const extracted: FeColorMatrixNativeProps = {};

  if (props.values !== undefined) {
    if (Array.isArray(props.values)) {
      extracted.values = props.values.map((num) =>
        typeof num === 'number' ? num : parseFloat(num)
      );
    } else if (typeof props.values === 'number') {
      extracted.values = [props.values];
    } else if (typeof props.values === 'string') {
      extracted.values = props.values
        .split(spaceReg)
        .map(parseFloat)
        .filter((el: number) => !isNaN(el));
    } else {
      console.warn('Invalid value for FeColorMatrix `values` prop');
    }
  }
  if (props.type) {
    extracted.type = props.type;
  }

  return extracted;
};

const defaultFill = { type: 0, payload: processColor('black') as ColorValue };
export default function extractFeFlood(
  props: FeFloodComponentProps
): FeFloodNativeProps {
  const extracted: FeFloodNativeProps = {};
  const { floodColor, floodOpacity } = props;

  if (floodColor != null) {
    extracted.floodColor =
      !floodColor && typeof floodColor !== 'number'
        ? defaultFill
        : (extractBrush(floodColor) as unknown as string);
  } else {
    // we want the default value of fill to be black to match the spec
    extracted.floodColor = defaultFill;
  }
  if (floodOpacity != null) {
    extracted.floodOpacity = extractOpacity(floodOpacity);
  }
  return extracted;
}

export const extractFeGaussianBlur = (
  props: FeGaussianBlurComponentProps
): FeGaussianBlurNativeProps => {
  const extracted: FeGaussianBlurNativeProps = {};

  if (Array.isArray(props.stdDeviation)) {
    extracted.stdDeviationX = Number(props.stdDeviation[0]) || 0;
    extracted.stdDeviationY = Number(props.stdDeviation[1]) || 0;
  } else if (
    typeof props.stdDeviation === 'string' &&
    props.stdDeviation.match(spaceReg)
  ) {
    const stdDeviation = props.stdDeviation.split(spaceReg);
    extracted.stdDeviationX = Number(stdDeviation[0]) || 0;
    extracted.stdDeviationY = Number(stdDeviation[1]) || 0;
  } else if (
    typeof props.stdDeviation === 'number' ||
    (typeof props.stdDeviation === 'string' &&
      !props.stdDeviation.match(spaceReg))
  ) {
    extracted.stdDeviationX = Number(props.stdDeviation) || 0;
    extracted.stdDeviationY = Number(props.stdDeviation) || 0;
  }
  if (props.edgeMode) {
    extracted.edgeMode = props.edgeMode;
  }
  return extracted;
};

export const extractFeMerge = (
  props: FeMergeComponentProps,
  parent: unknown
): FeMergeNativeProps => {
  const nodes: Array<string> = [];
  const childArray = props.children
    ? React.Children.map(props.children, (child) =>
        React.cloneElement(child, { parent })
      )
    : [];
  const l = childArray.length;
  for (let i = 0; i < l; i++) {
    const {
      props: { in: in1 },
    } = childArray[i];
    nodes.push(in1 || '');
  }

  return { nodes };
};

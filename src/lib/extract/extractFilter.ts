import { NativeProps as FeColorMatrixProps } from '../../fabric/FeColorMatrixNativeComponent';
import { NumberProp } from './types';

const spaceReg = /\s+/;

interface FilterPrimitiveStandardAttributes {
  x?: NumberProp;
  y?: NumberProp;
  width?: NumberProp;
  height?: NumberProp;
  result?: string;
}

export const extractFilter = (
  props: any
): FilterPrimitiveStandardAttributes => {
  const { x, y, width, height, result } = props;
  const extracted: FilterPrimitiveStandardAttributes = {
    x,
    y,
    width,
    height,
    result,
  };

  return extracted;
};

export const extractFeColorMatrix = (props: any): FeColorMatrixProps => {
  const extracted: FeColorMatrixProps = {};

  if (props.in) extracted.in1 = props.in;
  if (props.values !== undefined) {
    if (Array.isArray(props.values)) {
      extracted.values = props.values;
    } else if (typeof props.values === 'number') {
      extracted.values = [props.values];
    } else {
      extracted.values = props.values
        .split(spaceReg)
        .map(parseFloat)
        .filter((el: number) => !isNaN(el));
    }
  }
  if (props.type) extracted.type = props.type;

  return extracted;
};

import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ColorValue } from 'react-native';
import type {
  Float,
  Int32,
  WithDefault,
} from 'react-native/Libraries/Types/CodegenTypes';
import type { ViewProps } from './utils';

import type { UnsafeMixed } from './codegenUtils';
import { FontObject, NumberArray, NumberProp } from '../lib/extract/types';

interface SvgNodeCommonProps {
  name?: string;
  opacity?: WithDefault<Float, 1.0>;
  matrix?: ReadonlyArray<Float>;
  mask?: string;
  markerStart?: string;
  markerMid?: string;
  markerEnd?: string;
  clipPath?: string;
  clipRule?: WithDefault<Int32, 0>;
  responsible?: boolean;
  display?: string;
  pointerEvents?: string;
}

type ColorStruct = Readonly<{
  type?: WithDefault<Int32, -1>;
  payload?: ColorValue;
  brushRef?: string;
}>;

interface SvgRenderableCommonProps {
  fill?: ColorStruct;
  fillOpacity?: WithDefault<Float, 1.0>;
  fillRule?: WithDefault<Int32, 1>;
  stroke?: ColorStruct;
  strokeOpacity?: WithDefault<Float, 1.0>;
  strokeWidth?: UnsafeMixed<NumberProp>;
  strokeLinecap?: WithDefault<Int32, 0>;
  strokeLinejoin?: WithDefault<Int32, 0>;
  strokeDasharray?: UnsafeMixed<ReadonlyArray<NumberProp> | NumberProp>;
  strokeDashoffset?: Float;
  strokeMiterlimit?: Float;
  vectorEffect?: WithDefault<Int32, 0>;
  propList?: ReadonlyArray<string>;
}

interface SvgGroupCommonProps {
  fontSize?: UnsafeMixed<NumberProp>;
  fontWeight?: UnsafeMixed<NumberProp>;
  font?: UnsafeMixed<FontObject>;
}

interface SvgTextCommonProps {
  dx?: UnsafeMixed<NumberArray>;
  dy?: UnsafeMixed<NumberArray>;
  x?: UnsafeMixed<NumberArray>;
  y?: UnsafeMixed<NumberArray>;
  rotate?: UnsafeMixed<NumberArray>;
  inlineSize?: UnsafeMixed<NumberProp>;
  textLength?: UnsafeMixed<NumberProp>;
  baselineShift?: UnsafeMixed<NumberProp>;
  lengthAdjust?: string;
  alignmentBaseline?: string;
  verticalAlign?: UnsafeMixed<NumberProp>;
}
interface NativeProps
  extends ViewProps,
    SvgNodeCommonProps,
    SvgRenderableCommonProps,
    SvgGroupCommonProps,
    SvgTextCommonProps {
  href?: string;
  side?: string;
  method?: string;
  midLine?: string;
  spacing?: string;
  startOffset?: UnsafeMixed<NumberProp>;
}

export default codegenNativeComponent<NativeProps>('RNSVGTextPath');

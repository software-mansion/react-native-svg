import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ColorValue } from 'react-native';
import type {
  Float,
  Int32,
  WithDefault,
} from 'react-native/Libraries/Types/CodegenTypes';
import type { ViewProps } from './utils';

import type { UnsafeMixed } from './codegenUtils';
import { NumberProp } from '../lib/extract/types';

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

type FontObject = Readonly<{
  fontStyle?: string;
  fontVariant?: string;
  fontWeight?: string;
  fontStretch?: string;
  fontSize?: string;
  fontFamily?: string;
  textAnchor?: string;
  textDecoration?: string;
  letterSpacing?: string;
  wordSpacing?: string;
  kerning?: string;
  fontFeatureSettings?: string;
  fontVariantLigatures?: string;
  fontVariationSettings?: string;
}>;

interface SvgGroupCommonProps {
  fontSize?: string;
  fontWeight?: string;
  font?: FontObject;
}

interface NativeProps
  extends ViewProps,
    SvgNodeCommonProps,
    SvgRenderableCommonProps,
    SvgGroupCommonProps {
  x?: UnsafeMixed<NumberProp>;
  y?: UnsafeMixed<NumberProp>;
  height?: UnsafeMixed<NumberProp>;
  width?: UnsafeMixed<NumberProp>;
  maskUnits?: Int32;
  maskContentUnits?: Int32;
}

export default codegenNativeComponent<NativeProps>('RNSVGMask');

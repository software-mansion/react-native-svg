import { codegenNativeComponent } from 'react-native';
import type { CodegenTypes, ColorValue } from 'react-native';
import type { ViewProps } from './utils';

import type { UnsafeMixed } from './codegenUtils';
import { NumberProp } from '../lib/extract/types';

interface SvgNodeCommonProps {
  name?: string;
  opacity?: CodegenTypes.WithDefault<CodegenTypes.Float, 1.0>;
  matrix?: ReadonlyArray<CodegenTypes.Float>;
  mask?: string;
  markerStart?: string;
  markerMid?: string;
  markerEnd?: string;
  clipPath?: string;
  clipRule?: CodegenTypes.WithDefault<CodegenTypes.Int32, 0>;
  responsible?: boolean;
  display?: string;
  pointerEvents?: string;
}

type ColorStruct = Readonly<{
  type?: CodegenTypes.WithDefault<CodegenTypes.Int32, -1>;
  payload?: ColorValue;
  brushRef?: string;
}>;

type OnSvgLayoutEvent = Readonly<{
  layout: {
    x: CodegenTypes.Int32;
    y: CodegenTypes.Int32;
    width: CodegenTypes.Int32;
    height: CodegenTypes.Int32;
  };
}>;

interface SvgRenderableCommonProps {
  color?: ColorValue;
  fill?: UnsafeMixed<ColorValue | ColorStruct>;
  fillOpacity?: CodegenTypes.WithDefault<CodegenTypes.Float, 1.0>;
  fillRule?: CodegenTypes.WithDefault<CodegenTypes.Int32, 1>;
  stroke?: UnsafeMixed<ColorValue | ColorStruct>;
  strokeOpacity?: CodegenTypes.WithDefault<CodegenTypes.Float, 1.0>;
  strokeWidth?: UnsafeMixed<NumberProp>;
  strokeLinecap?: CodegenTypes.WithDefault<CodegenTypes.Int32, 0>;
  strokeLinejoin?: CodegenTypes.WithDefault<CodegenTypes.Int32, 0>;
  strokeDasharray?: UnsafeMixed<ReadonlyArray<NumberProp> | NumberProp>;
  strokeDashoffset?: CodegenTypes.Float;
  strokeMiterlimit?: CodegenTypes.Float;
  vectorEffect?: CodegenTypes.WithDefault<CodegenTypes.Int32, 0>;
  propList?: ReadonlyArray<string>;
  filter?: string;
}

interface NativeProps
  extends ViewProps,
    SvgNodeCommonProps,
    SvgRenderableCommonProps {
  cx?: UnsafeMixed<NumberProp>;
  cy?: UnsafeMixed<NumberProp>;
  r?: UnsafeMixed<NumberProp>;
  onSvgLayout?: CodegenTypes.DirectEventHandler<OnSvgLayoutEvent>;
}

export default codegenNativeComponent<NativeProps>('RNSVGCircle', {
  interfaceOnly: true,
});

import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
// TODO: import ImageSource from codegen types when it is available
import type {
  ColorValue,
  ImageSourcePropType as ImageSource,
} from 'react-native';
import type {
  DirectEventHandler,
  Float,
  Int32,
  WithDefault,
} from 'react-native/Libraries/Types/CodegenTypes';
import type { ViewProps } from './utils';

import type { UnsafeMixed } from './codegenUtils';
import { NumberProp } from '../lib/extract/types';

export type ImageLoadEventData = {
  source: {
    width: Float;
    height: Float;
    uri: string;
  };
};

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
  filter?: string;
}

interface NativeProps
  extends ViewProps,
    SvgNodeCommonProps,
    SvgRenderableCommonProps {
  x?: UnsafeMixed<NumberProp>;
  y?: UnsafeMixed<NumberProp>;
  width?: UnsafeMixed<NumberProp>;
  height?: UnsafeMixed<NumberProp>;
  src?: ImageSource | null;
  align?: string;
  meetOrSlice?: Int32;
  onLoad?: DirectEventHandler<ImageLoadEventData>;
}

export default codegenNativeComponent<NativeProps>('RNSVGImage', {
  interfaceOnly: true,
});

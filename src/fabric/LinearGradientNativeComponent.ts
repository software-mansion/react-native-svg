import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
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

interface NativeProps extends ViewProps, SvgNodeCommonProps {
  x1?: UnsafeMixed<NumberProp>;
  y1?: UnsafeMixed<NumberProp>;
  x2?: UnsafeMixed<NumberProp>;
  y2?: UnsafeMixed<NumberProp>;
  gradient?: ReadonlyArray<Float>;
  gradientUnits?: Int32;
  gradientTransform?: ReadonlyArray<Float> | null;
}

export default codegenNativeComponent<NativeProps>('RNSVGLinearGradient', {
  interfaceOnly: true,
});

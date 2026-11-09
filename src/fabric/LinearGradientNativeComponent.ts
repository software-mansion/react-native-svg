import { codegenNativeComponent } from 'react-native';
import type { CodegenTypes } from 'react-native';
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

interface NativeProps extends ViewProps, SvgNodeCommonProps {
  x1?: UnsafeMixed<NumberProp>;
  y1?: UnsafeMixed<NumberProp>;
  x2?: UnsafeMixed<NumberProp>;
  y2?: UnsafeMixed<NumberProp>;
  gradient?: ReadonlyArray<CodegenTypes.Float>;
  gradientUnits?: CodegenTypes.Int32;
  gradientTransform?: ReadonlyArray<CodegenTypes.Float> | null;
}

export default codegenNativeComponent<NativeProps>('RNSVGLinearGradient', {
  interfaceOnly: true,
});

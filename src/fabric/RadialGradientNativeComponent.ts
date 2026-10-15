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
  fx?: UnsafeMixed<NumberProp>;
  fy?: UnsafeMixed<NumberProp>;
  cx?: UnsafeMixed<NumberProp>;
  cy?: UnsafeMixed<NumberProp>;
  rx?: UnsafeMixed<NumberProp>;
  ry?: UnsafeMixed<NumberProp>;
  gradient?: ReadonlyArray<CodegenTypes.Float>;
  gradientUnits?: CodegenTypes.Int32;
  gradientTransform?: ReadonlyArray<CodegenTypes.Float> | null;
}

export default codegenNativeComponent<NativeProps>('RNSVGRadialGradient', {
  interfaceOnly: true,
});

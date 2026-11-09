import { codegenNativeComponent } from 'react-native';
import type { CodegenTypes } from 'react-native';
import type { ViewProps } from './utils';

import { NumberProp } from '../lib/extract/types';
import type { UnsafeMixed } from './codegenUtils';

type ColorMatrixType = 'matrix' | 'saturate' | 'hueRotate' | 'luminanceToAlpha';

interface FilterPrimitiveCommonProps {
  x?: UnsafeMixed<NumberProp>;
  y?: UnsafeMixed<NumberProp>;
  width?: UnsafeMixed<NumberProp>;
  height?: UnsafeMixed<NumberProp>;
  result?: string;
}

export interface NativeProps extends ViewProps, FilterPrimitiveCommonProps {
  in1?: string;
  type?: CodegenTypes.WithDefault<ColorMatrixType, 'matrix'>;
  values?: ReadonlyArray<CodegenTypes.Float>;
}

export default codegenNativeComponent<NativeProps>('RNSVGFeColorMatrix', {
  interfaceOnly: true,
});

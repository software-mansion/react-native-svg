import { codegenNativeComponent } from 'react-native';
import type { CodegenTypes } from 'react-native';
import type { ViewProps } from './utils';

import { NumberProp } from '../lib/extract/types';
import type { UnsafeMixed } from './codegenUtils';

type FeCompositeOperator =
  | 'over'
  | 'in'
  | 'out'
  | 'atop'
  | 'xor'
  | 'arithmetic';

interface FilterPrimitiveCommonProps {
  x?: UnsafeMixed<NumberProp>;
  y?: UnsafeMixed<NumberProp>;
  width?: UnsafeMixed<NumberProp>;
  height?: UnsafeMixed<NumberProp>;
  result?: string;
}

export interface NativeProps extends ViewProps, FilterPrimitiveCommonProps {
  in1?: string;
  in2?: string;
  operator1?: CodegenTypes.WithDefault<FeCompositeOperator, 'over'>;
  k1?: CodegenTypes.Float;
  k2?: CodegenTypes.Float;
  k3?: CodegenTypes.Float;
  k4?: CodegenTypes.Float;
}

export default codegenNativeComponent<NativeProps>('RNSVGFeComposite', {
  interfaceOnly: true,
});

import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ViewProps } from './utils';

import { NumberProp } from '../lib/extract/types';
import type { UnsafeMixed } from './codegenUtils';
import { Float, WithDefault } from 'react-native/Libraries/Types/CodegenTypes';

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
  operator1?: WithDefault<FeCompositeOperator, 'over'>;
  k1?: Float;
  k2?: Float;
  k3?: Float;
  k4?: Float;
}

export default codegenNativeComponent<NativeProps>('RNSVGFeComposite', {
  interfaceOnly: true,
});

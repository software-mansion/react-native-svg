import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ViewProps } from './utils';

import { NumberArray, NumberProp } from '../lib/extract/types';
import type { UnsafeMixed } from './codegenUtils';
import { WithDefault } from 'react-native/Libraries/Types/CodegenTypes';

interface FilterPrimitiveCommonProps {
  x?: UnsafeMixed<NumberProp>;
  y?: UnsafeMixed<NumberProp>;
  width?: UnsafeMixed<NumberProp>;
  height?: UnsafeMixed<NumberProp>;
  result?: string;
}

type FunctionChannel = 'R' | 'G' | 'B' | 'A' | 'UNKNOWN';
type FunctionType = 'identity' | 'table' | 'discrete' | 'linear' | 'gamma';

export interface NativeProps extends ViewProps, FilterPrimitiveCommonProps {
  channel?: WithDefault<FunctionChannel, 'UNKNOWN'>;
  type?: WithDefault<FunctionType, 'identity'>;
  tableValues?: UnsafeMixed<NumberArray>;
  slope?: WithDefault<UnsafeMixed<NumberProp>, 1>;
  intercept?: WithDefault<UnsafeMixed<NumberProp>, 0>;
  amplitude?: WithDefault<UnsafeMixed<NumberProp>, 1>;
  exponent?: WithDefault<UnsafeMixed<NumberProp>, 1>;
  offset?: WithDefault<UnsafeMixed<NumberProp>, 0>;
}

export default codegenNativeComponent<NativeProps>(
  'RNSVGFeComponentTransferFunction',
  {
    interfaceOnly: true,
  }
);

import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ViewProps } from './utils';

import { NumberProp } from '../lib/extract/types';
import type { UnsafeMixed } from './codegenUtils';

interface FilterPrimitiveCommonProps {
  x?: UnsafeMixed<NumberProp>;
  y?: UnsafeMixed<NumberProp>;
  width?: UnsafeMixed<NumberProp>;
  height?: UnsafeMixed<NumberProp>;
  result?: string;
}

export interface NativeProps extends ViewProps, FilterPrimitiveCommonProps {
  in1?: string;
  dx?: UnsafeMixed<NumberProp>;
  dy?: UnsafeMixed<NumberProp>;
}

export default codegenNativeComponent<NativeProps>('RNSVGFeOffset');

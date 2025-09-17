import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ViewProps } from './utils';

import type { NumberArray, NumberProp } from '../lib/extract/types';
import type { UnsafeMixed } from './codegenUtils';
import { WithDefault } from 'react-native/Libraries/Types/CodegenTypes';

interface FilterPrimitiveCommonProps {
  x?: UnsafeMixed<NumberProp>;
  y?: UnsafeMixed<NumberProp>;
  width?: UnsafeMixed<NumberProp>;
  height?: UnsafeMixed<NumberProp>;
  result?: string;
}

type FilterEdgeMode = 'duplicate' | 'wrap' | 'none';

export interface NativeProps extends ViewProps, FilterPrimitiveCommonProps {
  in1?: string;
  order?: UnsafeMixed<NumberArray>;
  kernelMatrix?: UnsafeMixed<NumberArray>;
  divisor?: UnsafeMixed<NumberProp>;
  bias?: WithDefault<UnsafeMixed<NumberProp>, 0>;
  targetX?: UnsafeMixed<NumberProp>;
  targetY?: UnsafeMixed<NumberProp>;
  edgeMode?: WithDefault<FilterEdgeMode, 'duplicate'>;
  preserveAlpha?: WithDefault<boolean, false>;
}

export default codegenNativeComponent<NativeProps>('RNSVGFeConvolveMatrix', {
  interfaceOnly: true,
});

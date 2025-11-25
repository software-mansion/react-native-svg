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

type OperatorType = 'erode' | 'dilate';

export interface NativeProps extends ViewProps, FilterPrimitiveCommonProps {
  in1?: string;
  operator1?: WithDefault<OperatorType, 'erode'>;
  radius?: UnsafeMixed<NumberArray>;
}

export default codegenNativeComponent<NativeProps>('RNSVGFeMorphology', {
  interfaceOnly: true,
});

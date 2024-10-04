import { Float, WithDefault } from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import { NumberProp } from '../lib/extract/types';
import type { UnsafeMixed } from './codegenUtils';
import type { ViewProps } from './utils';

type FilterEdgeMode = 'duplicate' | 'wrap' | 'none';

interface FilterPrimitiveCommonProps {
  x?: UnsafeMixed<NumberProp>;
  y?: UnsafeMixed<NumberProp>;
  width?: UnsafeMixed<NumberProp>;
  height?: UnsafeMixed<NumberProp>;
  result?: string;
}

export interface NativeProps extends ViewProps, FilterPrimitiveCommonProps {
  in1?: string;
  stdDeviationX?: Float;
  stdDeviationY?: Float;
  edgeMode?: WithDefault<FilterEdgeMode, 'none'>;
}

export default codegenNativeComponent<NativeProps>('RNSVGFeGaussianBlur');

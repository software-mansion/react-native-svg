import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import { NumberProp } from '../lib/extract/types';
import type { UnsafeMixed } from './codegenUtils';
import type { ViewProps } from './utils';

interface FilterPrimitiveCommonProps {
  x?: UnsafeMixed<NumberProp>;
  y?: UnsafeMixed<NumberProp>;
  width?: UnsafeMixed<NumberProp>;
  height?: UnsafeMixed<NumberProp>;
  result?: string;
}

export interface NativeProps extends ViewProps, FilterPrimitiveCommonProps {
  in1?: string;
}

export default codegenNativeComponent<NativeProps>('RNSVGFeTile', {
  interfaceOnly: true,
});

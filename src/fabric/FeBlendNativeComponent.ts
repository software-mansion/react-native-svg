import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import { NumberProp } from '../lib/extract/types';
import type { UnsafeMixed } from './codegenUtils';
import type { ViewProps } from './utils';
import { WithDefault } from 'react-native/Libraries/Types/CodegenTypes';

interface FilterPrimitiveCommonProps {
  x?: UnsafeMixed<NumberProp>;
  y?: UnsafeMixed<NumberProp>;
  width?: UnsafeMixed<NumberProp>;
  height?: UnsafeMixed<NumberProp>;
  result?: string;
}

type BlendMode =
  | 'unknown'
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'darken'
  | 'lighten';

export interface NativeProps extends ViewProps, FilterPrimitiveCommonProps {
  in1?: string;
  in2?: string;
  mode?: WithDefault<BlendMode, 'normal'>;
}

export default codegenNativeComponent<NativeProps>('RNSVGFeBlend', {
  interfaceOnly: true,
});

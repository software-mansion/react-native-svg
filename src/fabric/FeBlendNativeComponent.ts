import { codegenNativeComponent } from 'react-native';
import type { CodegenTypes } from 'react-native';
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
  mode?: CodegenTypes.WithDefault<BlendMode, 'normal'>;
}

export default codegenNativeComponent<NativeProps>('RNSVGFeBlend', {
  interfaceOnly: true,
});

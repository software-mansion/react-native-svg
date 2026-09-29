import type { WithDefault } from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { NumberProp } from '../lib/extract/types';
import type { UnsafeMixed } from './codegenUtils';
import type { ViewProps } from './utils';

interface FilterPrimitiveCommonProps {
  x?: UnsafeMixed<NumberProp>;
  y?: UnsafeMixed<NumberProp>;
  width?: UnsafeMixed<NumberProp>;
  height?: UnsafeMixed<NumberProp>;
  result?: string;
}

type ChannelSelector = 'R' | 'G' | 'B' | 'A';

export interface NativeProps extends ViewProps, FilterPrimitiveCommonProps {
  in1?: string;
  in2?: string;
  scale?: WithDefault<UnsafeMixed<NumberProp>, 0>;
  xChannelSelector?: WithDefault<ChannelSelector, 'A'>;
  yChannelSelector?: WithDefault<ChannelSelector, 'A'>;
}

export default codegenNativeComponent<NativeProps>('RNSVGFeDisplacementMap', {
  interfaceOnly: true,
});

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

type StitchTile = 'stitch' | 'noStitch';
type Type = 'fractalNoise' | 'turbulence';

export interface NativeProps extends ViewProps, FilterPrimitiveCommonProps {
  baseFrequency?: UnsafeMixed<NumberArray>;
  numOctaves?: WithDefault<UnsafeMixed<NumberProp>, 1>;
  seed?: WithDefault<UnsafeMixed<NumberProp>, 0>;
  stitchTiles?: WithDefault<StitchTile, 'noStitch'>;
  type?: WithDefault<Type, 'turbulence'>;
}

export default codegenNativeComponent<NativeProps>('RNSVGFeTurbulence', {
  interfaceOnly: true,
});

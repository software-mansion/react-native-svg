import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import { NumberProp } from '../lib/extract/types';
import type { UnsafeMixed } from './codegenUtils';
import type { ViewProps } from './utils';
import { WithDefault } from 'react-native/Libraries/Types/CodegenTypes';

type Units = 'userSpaceOnUse' | 'objectBoundingBox';

interface NativeProps extends ViewProps {
  name?: string;
  x?: UnsafeMixed<NumberProp>;
  y?: UnsafeMixed<NumberProp>;
  height?: UnsafeMixed<NumberProp>;
  width?: UnsafeMixed<NumberProp>;
  filterUnits?: WithDefault<Units, 'objectBoundingBox'>;
  primitiveUnits?: WithDefault<Units, 'userSpaceOnUse'>;
}

export default codegenNativeComponent<NativeProps>('RNSVGFilter', {
  interfaceOnly: true,
});

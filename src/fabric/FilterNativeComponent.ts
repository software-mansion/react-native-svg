import { codegenNativeComponent } from 'react-native';
import type { CodegenTypes } from 'react-native';
import { NumberProp } from '../lib/extract/types';
import type { UnsafeMixed } from './codegenUtils';
import type { ViewProps } from './utils';

type Units = 'userSpaceOnUse' | 'objectBoundingBox';

interface NativeProps extends ViewProps {
  name?: string;
  x?: UnsafeMixed<NumberProp>;
  y?: UnsafeMixed<NumberProp>;
  height?: UnsafeMixed<NumberProp>;
  width?: UnsafeMixed<NumberProp>;
  filterUnits?: CodegenTypes.WithDefault<Units, 'objectBoundingBox'>;
  primitiveUnits?: CodegenTypes.WithDefault<Units, 'userSpaceOnUse'>;
}

export default codegenNativeComponent<NativeProps>('RNSVGFilter', {
  interfaceOnly: true,
});

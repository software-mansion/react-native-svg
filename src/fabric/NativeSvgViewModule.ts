/* eslint-disable @typescript-eslint/ban-types */
// its needed for codegen to work
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import type { Int32 } from 'react-native/Libraries/Types/CodegenTypes';

export interface Spec extends TurboModule {
  toDataURL(
    tag: Int32 | null,
    options?: Object,
    callback?: (base64: string) => void
  ): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNSVGSvgViewModule');

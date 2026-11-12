/* eslint-disable @typescript-eslint/ban-types */
// its needed for codegen to work
import type { CodegenTypes, TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  toDataURL(
    tag: CodegenTypes.Double | null,
    options?: Object,
    callback?: (base64: string) => void
  ): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNSVGSvgViewModule');

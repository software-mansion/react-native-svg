import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  playTouchSound(): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNSVGSoundModule');

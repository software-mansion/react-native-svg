'use strict';

import type {
  EventHandlers,
  PressResponderConfig,
  ResponderConfig,
} from './hooks/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export let usePressEvents: (
  hostRef: any,
  config: PressResponderConfig
) => EventHandlers;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export let useResponderEvents: (hostRef: any, config: ResponderConfig) => void;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export let useMergeRefs: (
  ...args: ReadonlyArray<React.ElementRef<any>>
) => void;

try {
  usePressEvents =
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('react-native-web/dist/modules/usePressEvents').default;
} catch (e) {}

try {
  useResponderEvents =
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('react-native-web/dist/modules/useResponderEvents').default;
} catch (e) {}

try {
  useMergeRefs =
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('react-native-web/dist/modules/useMergeRefs').default;
} catch (e) {}

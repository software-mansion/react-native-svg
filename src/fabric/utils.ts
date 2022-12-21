import type { ViewProps as VP } from 'react-native';

interface ViewProps extends Omit<VP, 'pointerEvents'> {}

export type { ViewProps };

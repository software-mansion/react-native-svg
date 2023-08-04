import type { ViewProps as VP } from 'react-native';

type ViewProps = Omit<VP, 'pointerEvents'>;

export type { ViewProps };

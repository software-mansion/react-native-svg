import type { ViewProps as VP } from 'react-native';

type ViewProps = Omit<VP, 'pointerEvents' | 'hitSlop'>;

export type { ViewProps };

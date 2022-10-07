import type { ViewProps as VP } from 'react-native';

interface ViewProps extends Omit<VP, 'pointerEvents'> {}
interface EdgeInsetsValue {}

export type { ViewProps, EdgeInsetsValue };

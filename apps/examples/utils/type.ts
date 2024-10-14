import {EXAMPLES} from '../src/examples';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

export type ExamplesKey = keyof typeof EXAMPLES | 'E2E';

export interface Example {
  icon?: React.JSX.Element;
  title: string;
  samples: React.FC[];
  missingOnFabric?: boolean;
  shouldBeRenderInView?: boolean;
}

export type Examples = Record<string, Example>;

export type NavigationRoot = NativeStackNavigationProp<RootStackParamList>;
export type RootStackParamList = {[P in ExamplesKey]: undefined} & {
  Home: undefined;
  FeColorMatrix: undefined;
  FeGaussianBlur: undefined;
  FeMerge: undefined;
  FeOffset: undefined;
  ReanimatedFeColorMatrix: undefined;
  LocalImage: undefined;
  RemoteImage: undefined;
  FilterPicker: undefined;
};

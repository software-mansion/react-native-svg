import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigationProp} from '@react-navigation/stack';

export type ExamplesKey = string | 'E2E'; // FIXME: string

export interface Example {
  icon?: React.JSX.Element;
  samples: Sample[];
  missingOnFabric?: boolean;
  shouldBeRenderInView?: boolean;
}

export type Examples = Record<string, Example>;

export type NavigationProp =
  | NativeStackNavigationProp<RootStackParamList>
  | StackNavigationProp<RootStackParamList>;
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

export type Sample = React.FC & {title: string};

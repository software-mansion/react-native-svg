import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackNavigationProp} from '@react-navigation/stack';
import {allScreens} from '../index';

export type ExamplesKey = keyof typeof allScreens;

export interface Example {
  samples: Sample[] | Examples;
  icon: React.JSX.Element;
  shouldBeRenderInView?: boolean;
}

export type Examples = Record<string, Example>;

export type NavigationProp =
  | NativeStackNavigationProp<RootStackParamList>
  | StackNavigationProp<RootStackParamList>;
export type RootStackParamList = {[P in ExamplesKey]: undefined} & {
  RNSVG: undefined;
  Filters: undefined;
  'Filter Image': undefined;
  E2E: undefined;
};

export type Sample = React.FC & {title: string};

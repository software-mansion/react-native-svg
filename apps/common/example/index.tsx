/**
 * Sample React Native App for react-native-svg library
 * https://github.com/software-mansion/react-native-svg/tree/main/apps/common/example
 */
'use strict';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {ActivityIndicator, Platform, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {ListScreen} from './ListScreen';
import * as E2e from './e2e/index';
import {examples} from './examples';
import * as FilterImage from './examples/FilterImage';
import * as Filters from './examples/Filters';
import {commonStyles} from './utils/commonStyles';
import composeComponents from './utils/composeComponent';
import {
  Example,
  Examples,
  NavigationProp,
  RootStackParamList,
} from './utils/types';
import {usePersistNavigation} from './utils/usePersistNavigation';

export default function App() {
  const {isReady, initialState, persistNavigationState} =
    usePersistNavigation();

  if (!isReady) {
    return (
      <View style={[commonStyles.container, commonStyles.center]}>
        <ActivityIndicator />
      </View>
    );
  }
  if (process.env.E2E) {
    console.log('Opening E2E example, as E2E env is set to ' + process.env.E2E);
    return <E2e.component />;
  }
  return (
    <GestureHandlerRootView style={commonStyles.container}>
      <NavigationContainer
        initialState={initialState}
        onStateChange={persistNavigationState}>
        <Stack.Navigator
          screenOptions={{headerTintColor: '#f60', headerTitleAlign: 'center'}}>
          <Stack.Screen name="RNSVG" component={HomeList} />
          <Stack.Screen name="Filters" component={FiltersList} />
          <Stack.Screen name="Filter Image" component={FilterImageList} />
          {allScreensKeys.map(name => (
            <Stack.Screen
              key={name}
              name={name}
              component={composeComponents(
                allScreens[name].samples,
                (allScreens as Examples)[name].shouldBeRenderInView,
              )}
            />
          ))}
          <Stack.Screen name={'E2E'}>{E2e.component}</Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

type ScreenProps = {navigation: NavigationProp};
const HomeList = (props: ScreenProps) => (
  <ListScreen
    {...props}
    examples={{
      ...examples,
      Filters,
      'Filter Image': FilterImage,
      E2E: E2e as unknown as Example,
    }}
  />
);
const FiltersList = (props: ScreenProps) => (
  <ListScreen {...props} examples={Filters.samples} />
);
const FilterImageList = (props: ScreenProps) => (
  <ListScreen {...props} examples={FilterImage.samples} />
);

const Stack =
  Platform.OS === 'macos' || Platform.OS === 'windows'
    ? createStackNavigator<RootStackParamList>()
    : createNativeStackNavigator<RootStackParamList>();

const allScreens = {
  ...examples,
  ...Filters.samples,
  ...FilterImage.samples,
};

const allScreensKeys = Object.keys(allScreens) as (keyof typeof allScreens)[];

/**
 * Sample React Native App for react-native-svg library
 * https://github.com/software-mansion/react-native-svg/tree/main/apps/examples
 */
'use strict';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {ActivityIndicator, Platform, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {allScreens, allScreensKeys} from './src';
import {ListScreen} from './src/ListScreen';
import * as E2e from './src/e2e';
import {examples} from './src/examples';
import * as FilterImage from './src/examples/FilterImage';
import * as Filters from './src/examples/Filters';
import {commonStyles} from './src/utils/commonStyles';
import composeComponents from './src/utils/composeComponent';
import {
  Example,
  Examples,
  NavigationProp,
  RootStackParamList,
} from './src/utils/types';
import {usePersistNavigation} from './src/utils/usePersistNavigation';

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
          <Stack.Screen name={'E2E'} component={E2e.component} />
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
  Platform.OS === 'macos'
    ? createStackNavigator<RootStackParamList>()
    : createNativeStackNavigator<RootStackParamList>();

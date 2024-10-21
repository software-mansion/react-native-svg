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
import {ListScreen} from './src/ListScreen';
import {examples} from './src/examples';
import * as Filters from './src/examples/Filters';
import * as FilterImage from './src/examples/FilterImage';
import {commonStyles} from './src/utils/commonStyles';
import composeComponents from './src/utils/composeComponent';
import {NavigationProp, RootStackParamList} from './src/utils/types';
import {usePersistNavigation} from './src/utils/usePersistNavigation';

const allScreens = {...examples, ...Filters.examples, ...FilterImage.examples};
type ScreenProps = {navigation: NavigationProp};
const HomeList = (props: ScreenProps) => (
  <ListScreen
    {...props}
    examples={{
      ...examples,
      Filters: Filters as any,
      'Filter Image': FilterImage as any,
    }}
  /> // FIXME: Filters as any
);
const FiltersList = (props: ScreenProps) => (
  <ListScreen {...props} examples={Filters.examples} />
);
const FilterImageList = (props: ScreenProps) => (
  <ListScreen {...props} examples={FilterImage.examples} />
);

const Stack =
  Platform.OS === 'macos'
    ? createStackNavigator<RootStackParamList>()
    : createNativeStackNavigator<RootStackParamList>();

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
          {Object.keys(allScreens).map(name => (
            <Stack.Screen
              key={name}
              name={name}
              component={composeComponents(
                allScreens[name].samples,
                allScreens[name].shouldBeRenderInView,
              )}
            />
          ))}
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

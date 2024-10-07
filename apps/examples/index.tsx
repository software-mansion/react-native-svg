/**
 * Sample React Native App for react-native-svg library
 * https://github.com/magicismight/react-native-svg/tree/master/Example
 */
'use strict';

import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {NavigationContainer, NavigationState} from '@react-navigation/native';
import {View, Linking, Platform, ActivityIndicator} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createStackNavigator} from '@react-navigation/stack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {EXAMPLES} from './src/examples';
import composeComponents from './utils/composeComponent';
import E2eTestingView from './src/e2e';
import {commonStyles} from './src/commonStyles';
import type {RootStackParamList} from './utils/type';
import {names} from './utils/names';
import {Home} from './src/components/HomeScreen';
import {
  FeColorMatrix,
  FeGaussianBlur,
  FeMerge,
  FeOffset,
  ReanimatedFeColorMatrix,
} from './src/examples/Filters/examples';
import {FilterImageExamples} from './src/examples/FilterImage/examples';
const {LocalImage, FilterPicker, RemoteImage} = FilterImageExamples;

function noop() {
  // do nothing
}

const Stack =
  Platform.OS === 'macos'
    ? createStackNavigator<RootStackParamList>()
    : createNativeStackNavigator<RootStackParamList>();

// copied from https://reactnavigation.org/docs/state-persistence/
const PERSISTENCE_KEY = 'NAVIGATION_STATE_V1';

export default function App() {
  const [isReady, setIsReady] = useState(!__DEV__);
  const [initialState, setInitialState] = useState();

  useEffect(() => {
    const restoreState = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();

        if (
          Platform.OS !== 'web' &&
          Platform.OS !== 'macos' &&
          initialUrl == null
        ) {
          // Only restore state if there's no deep link and we're not on web
          const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
          const state = savedStateString
            ? JSON.parse(savedStateString)
            : undefined;

          if (state !== undefined) {
            setInitialState(state);
          }
        }
      } finally {
        setIsReady(true);
      }
    };

    if (!isReady) {
      restoreState().catch(noop);
    }
  }, [isReady]);

  const persistNavigationState = useCallback((state?: NavigationState) => {
    AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state)).catch(noop);
  }, []);

  if (!isReady) {
    return (
      <View style={[commonStyles.container, commonStyles.center]}>
        <ActivityIndicator />
      </View>
    );
  }

  if (process.env.E2E) {
    console.log('Opening E2E example, as E2E env is set to ' + process.env.E2E);
    return <E2eTestingView />;
  }

  return (
    <GestureHandlerRootView style={commonStyles.container}>
      <NavigationContainer
        initialState={initialState}
        onStateChange={persistNavigationState}>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{
              headerTitle: 'SVG library for React Apps',
              headerTintColor: '#f60',
              headerTitleAlign: 'center',
            }}
          />
          {names
            .filter(el => {
              if (el !== 'E2E') return true;
              return Platform.OS === 'android' || Platform.OS === 'ios';
            })
            .map(name => (
              <Stack.Screen
                key={name}
                name={name}
                component={composeComponents(
                  EXAMPLES[name].samples,
                  EXAMPLES[name].shouldBeRenderInView ?? false,
                )}
                options={{
                  headerTitle: EXAMPLES[name].title,
                  title: EXAMPLES[name].title,
                }}
              />
            ))}
          <Stack.Screen
            name="FeColorMatrix"
            component={composeComponents(FeColorMatrix.samples)}
          />
          <Stack.Screen
            name="FeGaussianBlur"
            component={composeComponents(FeGaussianBlur.samples)}
          />
          <Stack.Screen
            name="FeMerge"
            component={composeComponents(FeMerge.samples)}
          />
          <Stack.Screen
            name="FeOffset"
            component={composeComponents(FeOffset.samples)}
          />
          <Stack.Screen
            name="ReanimatedFeColorMatrix"
            component={composeComponents(ReanimatedFeColorMatrix.samples)}
          />
          <Stack.Screen
            name="LocalImage"
            component={composeComponents(LocalImage.samples)}
          />
          <Stack.Screen
            name="RemoteImage"
            component={composeComponents(RemoteImage.samples)}
          />
          <Stack.Screen
            name="FilterPicker"
            component={composeComponents(FilterPicker.samples)}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

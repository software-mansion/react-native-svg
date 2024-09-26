/**
 * Sample React Native App for react-native-svg library
 * https://github.com/magicismight/react-native-svg/tree/master/Example
 */
'use strict';

import {useCallback, useEffect, useState} from 'react';
import {
  NavigationContainer,
  NavigationProp,
  NavigationState,
  useNavigation,
} from '@react-navigation/native';
import {
  Text,
  View,
  Linking,
  Pressable,
  FlatList,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {EXAMPLES} from './src/examples';
import {HeaderBackButton} from '@react-navigation/elements';
import {HeaderBackButtonProps} from '@react-navigation/native-stack/lib/typescript/src/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import composeComponents from './utils/composeComponent';
import {commonStyles} from './src/commonStyles';
import {
  FeColorMatrix,
  FeGaussianBlur,
  FeMerge,
  FeOffset,
  ReanimatedFeColorMatrix,
} from './src/examples/Filters/examples';
import {
  LocalImage,
  FilterPicker,
  RemoteImage,
} from './src/examples/FilterImage/examples';

function noop() {
  // do nothing
}

const EXAMPLES_NAMES = Object.keys(EXAMPLES);

const Stack = createNativeStackNavigator();

type RootStackParamList = {[P in keyof typeof EXAMPLES]: undefined} & {
  Home: undefined;
};

interface HomeScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
}

function Home({navigation}: HomeScreenProps) {
  const [wasClicked, setWasClicked] = useState<string[]>([]);

  return (
    <SafeAreaView>
      <FlatList
        data={EXAMPLES_NAMES}
        style={commonStyles.list}
        initialNumToRender={EXAMPLES_NAMES.length}
        renderItem={({item: name}) => (
          <Item
            icon={EXAMPLES[name].icon}
            title={EXAMPLES[name].title}
            onPress={() => {
              navigation.navigate(name);
              if (!wasClicked.includes(name)) {
                setTimeout(() => setWasClicked([...wasClicked, name]), 500);
              }
            }}
            wasClicked={wasClicked.includes(name)}
          />
        )}
        ItemSeparatorComponent={ItemSeparator}
      />
    </SafeAreaView>
  );
}

export function ItemSeparator() {
  return <View style={commonStyles.separator} />;
}

function BackButton(props: HeaderBackButtonProps) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <HeaderBackButton {...props} onPress={() => navigation.navigate('Home')} />
  );
}

export interface ItemProps {
  icon?: any;
  title: string;
  onPress: () => void;
  wasClicked?: boolean;
}

export function Item({icon, title, onPress, wasClicked}: ItemProps) {
  return (
    <Pressable
      style={[commonStyles.button, wasClicked && commonStyles.visitedItem]}
      onPress={onPress}>
      {icon && (
        <>
          <View>{icon}</View>
          <Text>{'   '}</Text>
        </>
      )}

      <Text style={commonStyles.title}>{title}</Text>
    </Pressable>
  );
}

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

  return (
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
          }}
        />
        {EXAMPLES_NAMES.map(name => (
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
              headerLeft: Platform.OS === 'web' ? BackButton : undefined,
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
  );
}

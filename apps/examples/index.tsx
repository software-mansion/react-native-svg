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
  StyleSheet,
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

function noop() {
  // do nothing
}

const EXAMPLES_NAMES = Object.keys(EXAMPLES);

const Stack = createNativeStackNavigator();

console.log('EXAMPLES: ', EXAMPLES);

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
        style={styles.list}
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

function ItemSeparator() {
  return <View style={styles.separator} />;
}

function BackButton(props: HeaderBackButtonProps) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <HeaderBackButton {...props} onPress={() => navigation.navigate('Home')} />
  );
}

interface ItemProps {
  icon?: any;
  title: string;
  onPress: () => void;
  wasClicked?: boolean;
}

function Item({icon, title, onPress, wasClicked}: ItemProps) {
  return (
    <Pressable
      style={[styles.button, wasClicked && styles.visitedItem]}
      onPress={onPress}>
      {icon && (
        <>
          <View>{icon}</View>
          <Text>{'   '}</Text>
        </>
      )}

      <Text style={styles.title}>{title}</Text>
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
      <View style={[styles.container, styles.center]}>
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
              animation: 'default',
              headerTitle: EXAMPLES[name].title,
              title: EXAMPLES[name].title,
              headerLeft: Platform.OS === 'web' ? BackButton : undefined,
            }}
          />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    backgroundColor: '#EFEFF4',
  },
  separator: {
    height: 1,
    backgroundColor: '#DBDBE0',
  },
  button: {
    flex: 1,
    height: 60,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  disabledButton: {
    backgroundColor: 'grey',
    opacity: 0.5,
  },
  title: {
    fontSize: 16,
    color: 'black',
  },
  visitedItem: {
    backgroundColor: '#e6f0f7',
  },
});

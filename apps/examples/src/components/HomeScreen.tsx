import React, {useState, useMemo} from 'react';
import {FlatList, Platform} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../utils/type';
import {names} from '../../utils/names';
import {commonStyles} from '../commonStyles';
import {Item} from './Item';
import {ItemSeparator} from './ItemSeparator';
import {EXAMPLES} from '../examples';

interface HomeScreenProps {
  navigation:
    | StackNavigationProp<RootStackParamList, 'Home'>
    | NativeStackNavigationProp<RootStackParamList, 'Home'>;
}

export function Home({navigation}: HomeScreenProps) {
  const [wasClicked, setWasClicked] = useState<string[]>([]);

  const screenNames = useMemo(
    () =>
      names.filter(el => {
        if (el !== 'E2E') return true;
        return Platform.OS === 'android' || Platform.OS === 'ios';
      }),
    [],
  );

  return (
    <FlatList
      removeClippedSubviews={false}
      data={screenNames}
      style={commonStyles.list}
      numColumns={2}
      scrollEnabled={false}
      initialNumToRender={screenNames.length}
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
  );
}

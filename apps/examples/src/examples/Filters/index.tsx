import React, {useState} from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {Circle, Svg} from 'react-native-svg';

import {EXAMPLES} from './examples';
import {commonStyles} from '../../commonStyles';

import {useNavigation} from '@react-navigation/native';

const EXAMPLES_NAMES = Object.keys(EXAMPLES);

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

function FiltersList() {
  const navigation: any = useNavigation();
  const [wasClicked, setWasClicked] = useState<string[]>([]);

  return (
    <FlatList
      data={EXAMPLES_NAMES}
      style={styles.list}
      initialNumToRender={EXAMPLES_NAMES.length}
      scrollEnabled={false}
      horizontal={false}
      renderItem={({item: name}) => (
        <Item
          icon={EXAMPLES[name].icon}
          title={EXAMPLES[name].title}
          onPress={() => {
            navigation.navigate(EXAMPLES[name].title);
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

const icon = (
  <Svg height="30" width="30" viewBox="0 0 20 20">
    <Circle cx="10" cy="7.5" r="5" fill="blue" fillOpacity="0.5" />
    <Circle cx="7.5" cy="12.5" r="5" fill="green" fillOpacity="0.5" />
    <Circle cx="12.5" cy="12.5" r="5" fill="red" fillOpacity="0.5" />
  </Svg>
);

const samples = [FiltersList];

function ItemSeparator() {
  return <View style={styles.separator} />;
}

export {icon, samples};

//todo: add it to common styles
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
    width: '100%',
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

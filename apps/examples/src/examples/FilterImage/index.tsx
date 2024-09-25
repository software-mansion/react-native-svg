import React, {useState} from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

import {FilterImage} from 'react-native-svg/filter-image';
import {commonStyles} from '../../commonStyles';
import {EXAMPLES} from './examples';
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

function ItemSeparator() {
  return <View style={styles.separator} />;
}

function FilterImageList() {
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
  <FilterImage
    source={require('../../assets/image.jpg')}
    width={30}
    height={30}
    style={{filter: 'saturate(3.5)'}}
  />
);

const samples = [FilterImageList];

export {icon, samples};

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

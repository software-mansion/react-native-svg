import React, {useState} from 'react';
import {FlatList} from 'react-native';
import {Circle, Svg} from 'react-native-svg';

import {EXAMPLES} from './examples';
import {commonStyles} from '../../commonStyles';

import {useNavigation} from '@react-navigation/native';
import {Item, ItemSeparator} from '../../../index';

const EXAMPLES_NAMES = Object.keys(EXAMPLES);

function FiltersList() {
  const navigation: any = useNavigation();
  const [wasClicked, setWasClicked] = useState<string[]>([]);

  return (
    <FlatList
      data={EXAMPLES_NAMES}
      style={commonStyles.list}
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

const title = 'Filters example';
const samples = [FiltersList];

export {icon, samples, title};

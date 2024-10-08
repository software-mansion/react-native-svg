import React, {useState} from 'react';
import {FlatList} from 'react-native';
import {Circle, Svg} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';
import {FilterExamples as EXAMPLES} from './examples';
import {commonStyles} from '../../commonStyles';
import {Item} from '../../../src/components/Item';
import {ItemSeparator} from '../../../src/components/ItemSeparator';
import type {NavigationRoot} from '../../../utils/type';

const EXAMPLES_NAMES = Object.keys(EXAMPLES);

function FiltersList() {
  const navigation = useNavigation<NavigationRoot>();
  const [wasClicked, setWasClicked] = useState<string[]>([]);

  return (
    <FlatList
      removeClippedSubviews={false}
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

const shouldBeRenderInView = true;
const title = 'Filters example';
const samples = [FiltersList];

export {icon, samples, title, shouldBeRenderInView};

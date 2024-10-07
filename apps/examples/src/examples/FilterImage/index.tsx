import React, {useState} from 'react';
import {FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {FilterImage} from 'react-native-svg/filter-image';
import {commonStyles} from '../../commonStyles';
import {Item} from '../../components/Item';
import {ItemSeparator} from '../../components/ItemSeparator';
import {FilterImageExamples as EXAMPLES} from './examples';
import type {NavigationRoot} from '../../../utils/type';

const EXAMPLES_NAMES = Object.keys(EXAMPLES);

function FilterImageList() {
  const navigation = useNavigation<NavigationRoot>();
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
  <FilterImage
    source={require('../../assets/image.jpg')}
    width={30}
    height={30}
    style={{filter: 'saturate(3.5)'}}
  />
);

const title = 'FilterImage example';
const samples = [FilterImageList];

export {icon, samples, title};

import React, {useState} from 'react';
import {FlatList} from 'react-native';

import {FilterImage} from 'react-native-svg/filter-image';
import {commonStyles} from '../../commonStyles';
import {EXAMPLES} from './examples';
import {useNavigation} from '@react-navigation/native';
import {Item, ItemSeparator} from '../../../index';

const EXAMPLES_NAMES = Object.keys(EXAMPLES);

function FilterImageList() {
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

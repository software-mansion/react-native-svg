import React, {useState} from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {FilterImage, Filters} from 'react-native-svg/filter-image';

const img = require('../../assets/office.jpg');

const normal: Filters = [];
const losAngeles: Filters = [
  {
    name: 'colorMatrix',
    type: 'matrix',
    values: [1.8, 0, 0, 0, 0, 0, 1.3, 0, 0, 0, 0, 0, 1.2, 0, 0, 0, 0, 0, 1, 0],
  },
];
const lagos: Filters = [
  {
    name: 'colorMatrix',
    type: 'matrix',
    values: [
      1.4, 0, 0, 0, 0, 0, 1.2, 0, 0, 0, 0, 0, 1.5, 0, 0, 0, 0, 0, 0.9, 0,
    ],
  },
];
const tokyo: Filters = [
  {name: 'colorMatrix', type: 'saturate', values: [1.5]},
  {
    name: 'colorMatrix',
    type: 'matrix',

    values: [
      0.2, 0.2, 0.2, 0, 0, 0.2, 0.2, 0.2, 0, 0, 0.2, 0.2, 0.2, 0, 0, 0, 0, 0, 1,
      0,
    ],
  },
];
const saturated: Filters = [
  {name: 'colorMatrix', type: 'saturate', values: [1.5]},
];
const boring: Filters = [
  {
    name: 'colorMatrix',
    type: 'matrix',
    values: [
      0.6965, 0.3845, 0.0945, 0, 0, 0.1745, 0.8430000000000001, 0.084, 0, 0,
      0.136, 0.267, 0.5655, 0, 0, 0, 0, 0, 1, 0,
    ],
  },
];
const filters = {
  normal,
  losAngeles,
  lagos,
  tokyo,
  saturated,
  boring,
} as const;

type FilterKeys =
  | 'normal'
  | 'losAngeles'
  | 'lagos'
  | 'tokyo'
  | 'saturated'
  | 'boring';
const filterKeys = Object.keys(filters) as FilterKeys[];
const FilterImagePickerExample = () => {
  const [currentFilter, setCurrentFilter] = useState<FilterKeys>('normal');

  return (
    <View style={styles.container}>
      <FilterImage
        style={styles.image}
        source={img}
        filters={filters[currentFilter]}
      />

      <View>
        <FlatList
          data={filterKeys}
          horizontal
          style={styles.list}
          contentContainerStyle={styles.listElement}
          renderItem={({item}) => {
            return (
              <TouchableOpacity onPress={() => setCurrentFilter(item)}>
                <FilterImage
                  style={styles.listElementImage}
                  source={img}
                  filters={filters[item]}
                />
                <Text numberOfLines={1} style={styles.listElementTitle}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
};
FilterImagePickerExample.title = 'Filter picker';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get('window').height - 150,
    width: '100%',
  },
  image: {flex: 1, width: '100%', height: '100%'},
  list: {
    marginTop: 8,
    marginHorizontal: 8,
  },
  listElement: {gap: 8},
  listElementImage: {width: 70, height: 70},
  listElementTitle: {
    width: 70,
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 8,
  },
});

const icon = (
  <FilterImage
    filters={[{name: 'colorMatrix', type: 'saturate', values: [0.5]}]}
    source={img}
    width={30}
    height={30}
  />
);

const samples = [FilterImagePickerExample];
export {icon, samples};

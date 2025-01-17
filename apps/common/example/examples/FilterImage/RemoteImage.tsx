import React from 'react';
import {StyleSheet, View} from 'react-native';
import {FilterImage} from 'react-native-svg/filter-image';

const testSource = {
  uri: 'https://cdn.pixabay.com/photo/2023/03/17/11/39/mountain-7858482_1280.jpg',
};

const FilterImageRemoteExampleCSS = () => {
  return (
    <View>
      <FilterImage
        source={testSource}
        style={[styles.image, {filter: 'saturate(3)'}]}
      />
    </View>
  );
};
FilterImageRemoteExampleCSS.title = 'Remote image with CSS filter';

const FilterImageRemoteExample = () => {
  return (
    <View>
      <FilterImage
        source={testSource}
        style={styles.image}
        filters={[{name: 'feColorMatrix', type: 'saturate', values: [3]}]}
      />
    </View>
  );
};
FilterImageRemoteExample.title = 'Remote image with prop filters';

const FilterImageFewFiltersExample = () => {
  return (
    <View>
      <FilterImage
        filters={[
          {name: 'feColorMatrix', type: 'saturate', values: [10]},
          {
            name: 'feColorMatrix',
            type: 'matrix',
            values: '0.2 0.2 0.2 0 0 0.2 0.2 0.2 0 0 0.2 0.2 0.2 0 0 0 0 0 1 0',
          },
        ]}
        source={testSource}
        style={{width: 200, height: 200}}
      />
    </View>
  );
};
FilterImageFewFiltersExample.title = 'Remote image with filters';

const icon = (
  <FilterImage
    source={testSource}
    width={30}
    height={30}
    style={{filter: 'saturate(0.5)'}}
  />
);

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
  },
});
const samples = [
  FilterImageRemoteExampleCSS,
  FilterImageRemoteExample,
  FilterImageFewFiltersExample,
];

export {icon, samples};

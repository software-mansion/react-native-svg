import React from 'react';
import {View} from 'react-native';
import {FilterImage} from 'react-native-svg/filter-image';

const testImage = require('../../assets/image.jpg');

const FilterImageLocalExample = () => {
  return (
    <View>
      <FilterImage
        filters={[{name: 'colorMatrix', type: 'saturate', values: [0.5]}]}
        source={testImage}
      />
    </View>
  );
};
FilterImageLocalExample.title = 'Local image with filter';

const icon = (
  <FilterImage
    filters={[{name: 'colorMatrix', type: 'saturate', values: [0.5]}]}
    source={testImage}
    width={30}
    height={30}
  />
);

const samples = [FilterImageLocalExample];
export {icon, samples};

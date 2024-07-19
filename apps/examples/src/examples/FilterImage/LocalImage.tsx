import React from 'react';
import {View} from 'react-native';
import {FilterImage} from 'react-native-svg/filter-image';

const testImage = require('../../assets/image.jpg');

const FilterImageLocalExample = () => {
  return (
    <View>
      <FilterImage source={testImage} style={{filter: 'saturate(0.5)'}} />
    </View>
  );
};
FilterImageLocalExample.title = 'Local image with filter';

const icon = (
  <FilterImage
    source={testImage}
    width={30}
    height={30}
    style={{filter: 'saturate(0.5)'}}
  />
);

const samples = [FilterImageLocalExample];
export {icon, samples};

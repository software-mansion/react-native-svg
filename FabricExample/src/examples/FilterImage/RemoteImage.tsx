import React from 'react';
import {View} from 'react-native';
import {FilterImage} from 'react-native-svg/filter-image';

const testSource = {
  uri: 'https://cdn.pixabay.com/photo/2023/03/17/11/39/mountain-7858482_1280.jpg',
};

const FilterImageRemoteExample = () => {
  return (
    <View>
      <FilterImage
        filters={[{name: 'colorMatrix', type: 'saturate', values: [3]}]}
        source={testSource}
        style={{width: 200, height: 200}}
      />
    </View>
  );
};
FilterImageRemoteExample.title = 'Remote image with filter';

const FilterImageFewFiltersExample = () => {
  return (
    <View>
      <FilterImage
        filters={[
          {name: 'colorMatrix', type: 'saturate', values: [10]},
          {
            name: 'colorMatrix',
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
    filters={[{name: 'colorMatrix', type: 'saturate', values: [0.5]}]}
    source={testSource}
    width={30}
    height={30}
  />
);

const samples = [FilterImageRemoteExample, FilterImageFewFiltersExample];
export {icon, samples};

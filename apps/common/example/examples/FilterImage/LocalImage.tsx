import React from 'react';
import {View} from 'react-native';
import {FilterImage} from 'react-native-svg/filter-image';

const testImage = require('../../assets/image.jpg');

const FilterImageLocalExampleStyleCSS = () => {
  return (
    <View>
      <FilterImage source={testImage} style={{filter: 'saturate(0.5)'}} />
    </View>
  );
};
FilterImageLocalExampleStyleCSS.title = 'With style filter CSS';

const FilterImageLocalExampleStyleSVG = () => {
  return (
    <View>
      <FilterImage
        source={testImage}
        style={{
          filter: [{name: 'feColorMatrix', type: 'saturate', values: 0.5}],
        }}
      />
    </View>
  );
};
FilterImageLocalExampleStyleSVG.title = 'With style filter SVG';

const FilterImageLocalExamplePropSVG = () => {
  return (
    <View>
      <FilterImage
        source={testImage}
        filters={[{name: 'feColorMatrix', type: 'saturate', values: 0.5}]}
      />
    </View>
  );
};
FilterImageLocalExamplePropSVG.title = 'With prop filters SVG';

const icon = (
  <FilterImage
    source={testImage}
    width={30}
    height={30}
    style={{filter: 'saturate(0.5)'}}
  />
);
const samples = [
  FilterImageLocalExampleStyleCSS,
  FilterImageLocalExampleStyleSVG,
  FilterImageLocalExamplePropSVG,
];

export {icon, samples};

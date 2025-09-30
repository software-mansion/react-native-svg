import React from 'react';
import {FilterImage} from 'react-native-svg/filter-image';
import * as FilterPicker from './FilterPicker';
import * as LocalImage from './LocalImage';
import * as RemoteImage from './RemoteImage';

const samples = {
  LocalImage,
  RemoteImage,
  FilterPicker,
};

const icon = (
  <FilterImage
    source={require('../../assets/image.jpg')}
    width={30}
    height={30}
    style={{filter: 'saturate(3.5)'}}
  />
);

export {icon, samples};

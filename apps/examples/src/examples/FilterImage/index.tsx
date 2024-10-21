import React from 'react';
import {FilterImage} from 'react-native-svg/filter-image';
import type {Examples} from '../../utils/types';
import * as FilterPicker from './FilterPicker';
import * as LocalImage from './LocalImage';
import * as RemoteImage from './RemoteImage';

const examples: Examples = {
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
const title = 'Filters';

export {examples, icon, title};

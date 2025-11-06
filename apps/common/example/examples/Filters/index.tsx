import React from 'react';
import Svg, {Circle} from 'react-native-svg';
import * as FeBlend from './FeBlend';
import * as FeColorMatrix from './FeColorMatrix';
import * as FeComposite from './FeComposite';
import * as FeDropShadow from './FeDropShadow';
import * as FeFlood from './FeFlood';
import * as FeGaussianBlur from './FeGaussianBlur';
import * as FeMerge from './FeMerge';
import * as FeOffset from './FeOffset';
import * as ReanimatedFeColorMatrix from './ReanimatedFeColorMatrix';

const samples = {
  FeBlend,
  FeColorMatrix,
  FeComposite,
  FeDropShadow,
  FeFlood,
  FeGaussianBlur,
  FeMerge,
  FeOffset,
  ReanimatedFeColorMatrix,
};

const icon = (
  <Svg height="30" width="30" viewBox="0 0 20 20">
    <Circle cx="10" cy="7.5" r="5" fill="blue" fillOpacity="0.5" />
    <Circle cx="7.5" cy="12.5" r="5" fill="green" fillOpacity="0.5" />
    <Circle cx="12.5" cy="12.5" r="5" fill="red" fillOpacity="0.5" />
  </Svg>
);

export {icon, samples};

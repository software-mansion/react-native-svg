import React from 'react';
import {Rect, Svg} from 'react-native-svg';

function EmptyExample() {
  return <Svg height="400" width="400"></Svg>;
}
EmptyExample.title = '';

const icon = (
  <Svg height="30" width="30" viewBox="0 0 20 20">
    <Rect x="0" y="0" width="20" height="20" fill="none" stroke="black" />
  </Svg>
);
const samples = [EmptyExample];

export {icon, samples};

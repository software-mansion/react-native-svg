import React from 'react';
import {FeOffset, Filter, Rect, Svg} from 'react-native-svg';

function ReferenceExample() {
  return (
    <Svg width="200" height="200">
      <Filter id="offset" width="180" height="180">
        <FeOffset dx="50" dy="50" />
      </Filter>

      <Rect x="0" y="0" width="100" height="100" stroke="black" fill="red" />
      <Rect x="0" y="0" width="50" height="50" stroke="black" fill="none" />
      <Rect
        x="0"
        y="0"
        width="100"
        height="100"
        stroke="black"
        fill="blue"
        filter="url(#offset)"
      />
    </Svg>
  );
}
ReferenceExample.title = 'Offset';

const icon = (
  <Svg height="30" width="30" viewBox="0 0 20 20">
    <Filter id="iconOffset" width="1.5" height="1.5">
      <FeOffset dx="5" dy="5" />
    </Filter>
    <Rect x="0" y="0" width="15" height="15" fill="red" />
    <Rect
      x="0"
      y="0"
      width="15"
      height="15"
      fill="blue"
      filter="url(#iconOffset)"
    />
  </Svg>
);
const samples = [ReferenceExample];

export {icon, samples};

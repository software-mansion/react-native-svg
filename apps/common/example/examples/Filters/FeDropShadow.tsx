import React from 'react';
import {Circle, FeDropShadow, Filter, Svg} from 'react-native-svg';

BasicMDN.title = 'Basic MDN example';
function BasicMDN() {
  return (
    <Svg viewBox="0 0 30 10" width="300" height="100">
      <Filter id="shadow">
        <FeDropShadow dx="0.2" dy="0.4" stdDeviation="0.2" />
      </Filter>
      <Filter id="shadow2">
        <FeDropShadow dx="0" dy="0" stdDeviation="5" floodColor="cyan" />
      </Filter>
      <Filter id="shadow3">
        <FeDropShadow
          dx="-0.8"
          dy="-0.8"
          stdDeviation="0"
          floodColor="pink"
          floodOpacity="0.5"
        />
      </Filter>
      <Circle cx="5" cy="50%" r="4" fill="pink" filter="url(#shadow)" />
      <Circle cx="15" cy="50%" r="4" fill="pink" filter="url(#shadow2)" />
      <Circle cx="25" cy="50%" r="4" fill="pink" filter="url(#shadow3)" />
    </Svg>
  );
}

const icon = (
  <Svg height="30" width="30" viewBox="0 0 100 100">
    <Filter id="dropShadowIcon" x="-1" width="3" y="-1" height="3">
      <FeDropShadow dx="3" dy="3" stdDeviation="2" floodOpacity="0.7" />
    </Filter>
    <Circle
      cx="50"
      cy="50"
      r="30"
      fill="lightblue"
      filter="url(#dropShadowIcon)"
    />
  </Svg>
);
const samples = [BasicMDN];

export {icon, samples};

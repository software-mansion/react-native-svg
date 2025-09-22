import React from 'react';
import {Defs, FeTurbulence, Filter, Rect, Svg, Text} from 'react-native-svg';

function W3CExample() {
  return (
    <Svg width="400" height="700">
      <Defs>
        <Filter
          id="Turb1"
          filterUnits="objectBoundingBox"
          x="0%"
          y="0%"
          width="100%"
          height="100%">
          <FeTurbulence type="turbulence" baseFrequency="0.01 0.1" />
        </Filter>
        <Filter
          id="Turb2"
          filterUnits="objectBoundingBox"
          x="0%"
          y="0%"
          width="100%"
          height="100%">
          <FeTurbulence type="turbulence" baseFrequency="0.1 0.01" />
        </Filter>
        <Filter
          id="Turb3"
          filterUnits="objectBoundingBox"
          x="0%"
          y="0%"
          width="100%"
          height="100%">
          <FeTurbulence type="turbulence" baseFrequency="0.001 1" />
        </Filter>
      </Defs>

      <Rect x="20" y="25" width="360" height="150" filter="url(#Turb1)" />
      <Text x="20" y="190">
        (type=turbulence | baseFrequency="0.01 0.1" | numOctaves=1)
      </Text>

      <Rect x="20" y="215" width="360" height="150" filter="url(#Turb2)" />
      <Text x="20" y="380">
        (type=turbulence | baseFrequency="0.1 0.01" | numOctaves=1)
      </Text>

      <Rect x="20" y="405" width="360" height="150" filter="url(#Turb3)" />
      <Text x="20" y="570">
        (type=turbulence | baseFrequency="0.001 1" | numOctaves=1)
      </Text>
    </Svg>
  );
}
W3CExample.title = 'W3C example';

const icon = (
  <Svg height="30" width="30" viewBox="0 0 20 20">
    <Filter
      id="Turb1"
      filterUnits="objectBoundingBox"
      x="0%"
      y="0%"
      width="100%"
      height="100%">
      <FeTurbulence type="turbulence" baseFrequency="0.001 1" numOctaves="1" />
    </Filter>
    <Rect x="0" y="0" width="30" height="30" filter="url(#Turb1)" />
  </Svg>
);
const samples = [W3CExample];

export {icon, samples};

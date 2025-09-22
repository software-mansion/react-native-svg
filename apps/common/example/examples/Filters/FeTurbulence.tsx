import React from 'react';
import {
  Defs,
  FeOffset,
  FeTurbulence,
  Filter,
  Rect,
  Svg,
  Text,
} from 'react-native-svg';

function W3CExample() {
  return (
    <Svg width="400" height="1200">
      <Defs>
        <Filter
          id="Turb1"
          filterUnits="objectBoundingBox"
          x="0%"
          y="0%"
          width="100%"
          height="100%">
          <FeTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" />
        </Filter>
        <Filter
          id="Turb2"
          filterUnits="objectBoundingBox"
          x="0%"
          y="0%"
          width="100%"
          height="100%">
          <FeTurbulence type="turbulence" baseFrequency="0.1" numOctaves="2" />
        </Filter>
        <Filter
          id="Turb3"
          filterUnits="objectBoundingBox"
          x="0%"
          y="0%"
          width="100%"
          height="100%">
          <FeTurbulence type="turbulence" baseFrequency="0.05" numOctaves="8" />
        </Filter>
        <Filter
          id="Turb4"
          filterUnits="objectBoundingBox"
          x="0%"
          y="0%"
          width="100%"
          height="100%">
          <FeTurbulence
            type="fractalNoise"
            baseFrequency="0.1"
            numOctaves="4"
          />
        </Filter>
        <Filter
          id="Turb5"
          filterUnits="objectBoundingBox"
          x="0%"
          y="0%"
          width="100%"
          height="100%">
          <FeTurbulence
            type="fractalNoise"
            baseFrequency="0.4"
            numOctaves="4"
          />
        </Filter>
        <Filter
          id="Turb6"
          filterUnits="objectBoundingBox"
          x="0%"
          y="0%"
          width="100%"
          height="100%">
          <FeTurbulence
            type="fractalNoise"
            baseFrequency="0.1"
            numOctaves="1"
          />
        </Filter>
      </Defs>

      <Rect x="20" y="25" width="360" height="150" filter="url(#Turb1)" />
      <Text x="50" y="190">
        (type=turbulence | baseFrequency=0.05 | numOctaves=2)
      </Text>

      <Rect x="20" y="215" width="360" height="150" filter="url(#Turb2)" />
      <Text x="50" y="380">
        (type=turbulence | baseFrequency=0.1 | numOctaves=2)
      </Text>

      <Rect x="20" y="405" width="360" height="150" filter="url(#Turb3)" />
      <Text x="50" y="570">
        (type=turbulence | baseFrequency=0.05 | numOctaves=8)
      </Text>

      <Rect x="20" y="595" width="360" height="150" filter="url(#Turb4)" />
      <Text x="50" y="760">
        (type=fractalNoise | baseFrequency=0.1 | numOctaves=4)
      </Text>

      <Rect x="20" y="785" width="360" height="150" filter="url(#Turb5)" />
      <Text x="50" y="950">
        (type=fractalNoise | baseFrequency=0.4 | numOctaves=4)
      </Text>

      <Rect x="20" y="975" width="360" height="150" filter="url(#Turb6)" />
      <Text x="50" y="1140">
        (type=fractalNoise | baseFrequency=0.1 | numOctaves=1)
      </Text>
    </Svg>
  );
}
W3CExample.title = 'W3C example';

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
const samples = [W3CExample];

export {icon, samples};

import React from 'react';
import {Circle, FeColorMatrix, Filter, G, Svg} from 'react-native-svg';

function ReferenceExample() {
  return (
    <Svg height="150" width="150">
      <Circle cx="75" cy="50" r="40" fill="blue" fillOpacity="0.5" />
      <Circle cx="55" cy="90" r="40" fill="green" fillOpacity="0.5" />
      <Circle cx="95" cy="90" r="40" fill="red" fillOpacity="0.5" />
    </Svg>
  );
}
ReferenceExample.title = 'Reference';

function IdentityExample() {
  return (
    <Svg height="150" width="150">
      <Filter id="filterIdentity">
        <FeColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0" />
      </Filter>
      <G filter="url(#filterIdentity)">
        <Circle cx="75" cy="50" r="40" fill="blue" fillOpacity="0.5" />
        <Circle cx="55" cy="90" r="40" fill="green" fillOpacity="0.5" />
        <Circle cx="95" cy="90" r="40" fill="red" fillOpacity="0.5" />
      </G>
    </Svg>
  );
}
IdentityExample.title = 'Identity matrix';

function RgbToGreenExample() {
  return (
    <Svg height="150" width="150">
      <Filter id="filterGreen">
        <FeColorMatrix
          values="0 0 0 0 0
                    1 1 1 1 0
                    0 0 0 0 0
                    0 0 0 1 0"
        />
      </Filter>
      <G filter="url(#filterGreen)">
        <Circle cx="75" cy="50" r="40" fill="blue" fillOpacity="0.5" />
        <Circle cx="55" cy="90" r="40" fill="green" fillOpacity="0.5" />
        <Circle cx="95" cy="90" r="40" fill="red" fillOpacity="0.5" />
      </G>
    </Svg>
  );
}
RgbToGreenExample.title = 'RGB to Green';

function SaturateExample() {
  return (
    <Svg height="150" width="150">
      <Filter id="filterSaturate">
        <FeColorMatrix type="saturate" values="0.2" />
      </Filter>
      <G filter="url(#filterSaturate)">
        <Circle cx="75" cy="50" r="40" fill="blue" fillOpacity="0.5" />
        <Circle cx="55" cy="90" r="40" fill="green" fillOpacity="0.5" />
        <Circle cx="95" cy="90" r="40" fill="red" fillOpacity="0.5" />
      </G>
    </Svg>
  );
}
SaturateExample.title = 'Saturate';

function HueRotateExample() {
  return (
    <Svg height="150" width="150">
      <Filter id="filterHue">
        <FeColorMatrix type="hueRotate" values="180" />
      </Filter>
      <G filter="url(#filterHue)">
        <Circle cx="75" cy="50" r="40" fill="blue" fillOpacity="0.5" />
        <Circle cx="55" cy="90" r="40" fill="green" fillOpacity="0.5" />
        <Circle cx="95" cy="90" r="40" fill="red" fillOpacity="0.5" />
      </G>
    </Svg>
  );
}
HueRotateExample.title = 'Hue Rotate';

function LuminanceToAlphaExample() {
  return (
    <Svg height="150" width="150">
      <Filter id="filterLuminance">
        <FeColorMatrix type="luminanceToAlpha" />
      </Filter>
      <G filter="url(#filterLuminance)">
        <Circle cx="75" cy="50" r="40" fill="blue" fillOpacity="0.5" />
        <Circle cx="55" cy="90" r="40" fill="green" fillOpacity="0.5" />
        <Circle cx="95" cy="90" r="40" fill="red" fillOpacity="0.5" />
      </G>
    </Svg>
  );
}
LuminanceToAlphaExample.title = 'Luminance to alpha';

const icon = (
  <Svg height="30" width="30" viewBox="0 0 20 20">
    <Filter id="filterIcon">
      <FeColorMatrix values="0 0 0 0 0 1 1 1 1 0 0 0 0 0 0 0 0 0 1 0" />
    </Filter>
    <G filter="url(#filterIcon)">
      <Circle cx="10" cy="7.5" r="5" fill="blue" fillOpacity="0.5" />
      <Circle cx="7.5" cy="12.5" r="5" fill="green" fillOpacity="0.5" />
      <Circle cx="12.5" cy="12.5" r="5" fill="red" fillOpacity="0.5" />
    </G>
  </Svg>
);
const samples = [
  ReferenceExample,
  IdentityExample,
  RgbToGreenExample,
  SaturateExample,
  HueRotateExample,
  LuminanceToAlphaExample,
];

export {icon, samples};

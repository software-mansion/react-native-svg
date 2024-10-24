import React from 'react';
import {Circle, FeGaussianBlur, Filter, G, Svg} from 'react-native-svg';

function StdDeviation3Example() {
  return (
    <Svg height="150" width="150">
      <Filter id="filter1">
        <FeGaussianBlur stdDeviation="3" />
      </Filter>
      <G filter="url(#filter1)">
        <Circle cx="75" cy="50" r="40" fill="blue" fillOpacity="0.5" />
        <Circle cx="55" cy="90" r="40" fill="green" fillOpacity="0.5" />
        <Circle cx="95" cy="90" r="40" fill="red" fillOpacity="0.5" />
      </G>
    </Svg>
  );
}
StdDeviation3Example.title = 'stdDeviation="3"';

function StdDeviation7Example() {
  return (
    <Svg height="150" width="150">
      <Filter id="filter2">
        <FeGaussianBlur stdDeviation="7" />
      </Filter>
      <G filter="url(#filter2)">
        <Circle cx="75" cy="50" r="40" fill="blue" fillOpacity="0.5" />
        <Circle cx="55" cy="90" r="40" fill="green" fillOpacity="0.5" />
        <Circle cx="95" cy="90" r="40" fill="red" fillOpacity="0.5" />
      </G>
    </Svg>
  );
}
StdDeviation7Example.title = 'stdDeviation="7"';
function StdDeviation150Example() {
  return (
    <Svg height="150" width="150">
      <Filter id="filter3">
        <FeGaussianBlur stdDeviation="15 0" />
      </Filter>
      <G filter="url(#filter3)">
        <Circle cx="75" cy="50" r="40" fill="blue" fillOpacity="0.5" />
        <Circle cx="55" cy="90" r="40" fill="green" fillOpacity="0.5" />
        <Circle cx="95" cy="90" r="40" fill="red" fillOpacity="0.5" />
      </G>
    </Svg>
  );
}
StdDeviation150Example.title = 'stdDeviation="15 0"';

function StdDeviation025Example() {
  return (
    <Svg height="150" width="150">
      <Filter id="filter4">
        <FeGaussianBlur stdDeviation="0 25" />
      </Filter>
      <G filter="url(#filter4)">
        <Circle cx="75" cy="50" r="40" fill="blue" fillOpacity="0.5" />
        <Circle cx="55" cy="90" r="40" fill="green" fillOpacity="0.5" />
        <Circle cx="95" cy="90" r="40" fill="red" fillOpacity="0.5" />
      </G>
    </Svg>
  );
}
StdDeviation025Example.title = 'stdDeviation="0 25"';

const icon = (
  <Svg height="30" width="30" viewBox="0 0 20 20">
    <Filter id="filter5">
      <FeGaussianBlur stdDeviation="3" />
    </Filter>
    <G filter="url(#filter5)">
      <Circle cx="10" cy="7.5" r="5" fill="blue" fillOpacity="0.5" />
      <Circle cx="7.5" cy="12.5" r="5" fill="green" fillOpacity="0.5" />
      <Circle cx="12.5" cy="12.5" r="5" fill="red" fillOpacity="0.5" />
    </G>
  </Svg>
);
const samples = [
  StdDeviation3Example,
  StdDeviation7Example,
  StdDeviation150Example,
  StdDeviation025Example,
];
export {icon, samples};

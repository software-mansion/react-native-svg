import React from 'react';
import {
  Circle,
  FeFlood,
  FeMerge,
  FeMergeNode,
  Filter,
  G,
  Line,
  Rect,
  Svg,
} from 'react-native-svg';

BasicFlood.title = 'Basic MDN example with Use';
function BasicFlood() {
  return (
    <Svg width="200" height="200">
      <Filter id="floodFilter" filterUnits="userSpaceOnUse">
        <FeFlood
          x="50"
          y="50"
          width="100"
          height="100"
          floodColor="green"
          floodOpacity="0.5"
        />
      </Filter>
      <Rect x="0" y="0" width="1" height="1" filter="url(#floodFilter)" />
    </Svg>
  );
}

TestCase1.title = 'Custom Test Case 1';
function TestCase1() {
  return (
    <Svg width="200" height="200" viewBox="0 0 200 200">
      <Filter
        id="floodFilter"
        // x="50%"
        filterUnits="userSpaceOnUse"
        primitiveUnits="userSpaceOnUse">
        <FeFlood
          // y="-10%"
          x="10%"
          // width="50%"
          // height="50%"
          flood-color="red"
          flood-opacity="0.5"
          floodColor="yellow"
          floodOpacity="0.5"
        />
      </Filter>
      <Rect x="0" y="0" width="100" height="100" fill="blue" />
      <Circle cx="50" cy="50" r="40" filter="url(#floodFilter)" />
    </Svg>
  );
}

TestCase2.title = 'Custom Test Case 2';
function TestCase2() {
  return (
    <Svg width="200" height="400">
      <Filter
        id="flood"
        x="0"
        y="0"
        width="100%"
        height="100%"
        primitiveUnits="objectBoundingBox">
        <FeFlood
          x="25%"
          y="25%"
          width="50%"
          height="50%"
          floodColor="green"
          floodOpacity="0.75"
        />
      </Filter>
      <Filter id="merge" primitiveUnits="objectBoundingBox">
        <FeMerge x="25%" y="25%" width="50%" height="50%">
          <FeMergeNode in="SourceGraphic" />
        </FeMerge>
      </Filter>

      <G fill="none" stroke="blue" strokeWidth="4">
        <Rect width="200" height="200" />
        <Line x2="200" y2="200" />
        <Line x1="200" y2="200" />
      </G>
      <Circle fill="green" filter="url(#flood)" cx="100" cy="100" r="90" />
      <Rect x="55" y="55" width="90" height="90" />
      <G transform="translate(0 200)">
        <G fill="none" stroke="blue" strokeWidth="4">
          <Rect width="200" height="200" />
          <Line x2="200" y2="200" />
          <Line x1="200" y2="200" />
        </G>
        <Circle
          fill="green"
          fillOpacity="0.5"
          filter="url(#merge)"
          cx="100"
          cy="100"
          r="90"
        />
      </G>
      <Rect x="55" y="255" width="90" height="90" fillOpacity=".7" />
    </Svg>
  );
}

const icon = (
  <Svg height="30" width="30" viewBox="0 0 140 140">
    <Filter
      id="floodFilterIcon"
      x="50%"
      filterUnits="userSpaceOnUse"
      primitiveUnits="userSpaceOnUse">
      <FeFlood
        y="-10%"
        x="10%"
        width="50%"
        height="50%"
        floodColor="yellow"
        floodOpacity="0.5"
      />
    </Filter>
    <Rect x="0" y="0" width="100" height="100" fill="blue" />
    <Circle cx="50" cy="50" r="40" filter="url(#floodFilterIcon)" />
  </Svg>
);
const samples = [BasicFlood, TestCase1, TestCase2];

export {icon, samples};

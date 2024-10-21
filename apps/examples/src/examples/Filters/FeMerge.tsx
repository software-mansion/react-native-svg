import React from 'react';
import {
  Svg,
  FeColorMatrix,
  Filter,
  FeMerge,
  FeMergeNode,
  Rect,
  FeOffset,
} from 'react-native-svg';

function WithOffsetsExample() {
  return (
    <Svg width="200" height="200">
      <Filter id="mergeWithOffset" width="180" height="180">
        <FeOffset dx="50" dy="50" result="test" />
        <FeOffset dx="100" dy="100" in="SourceGraphic" />
        <FeMerge>
          <FeMergeNode in="SourceGraphic" />
          <FeMergeNode in="test" />
          <FeMergeNode />
        </FeMerge>
      </Filter>
      <Rect
        x="0"
        y="0"
        width="100"
        height="100"
        stroke="black"
        fill="red"
        filter="url(#mergeWithOffset)"
      />
    </Svg>
  );
}
WithOffsetsExample.title = 'Merge with SourceGraphic and offsets';

function WithHueRotateExample() {
  return (
    <Svg width="150" height="150">
      <Filter id="mergeWithHue" width="180" height="180">
        <FeOffset dx="50" dy="50" />
        <FeColorMatrix type="hueRotate" values="240" />
        <FeMerge>
          <FeMergeNode />
          <FeMergeNode in="SourceGraphic" />
        </FeMerge>
      </Filter>
      <Rect
        x="0"
        y="0"
        width="100"
        height="100"
        stroke="black"
        fill="red"
        filter="url(#mergeWithHue)"
      />
    </Svg>
  );
}
WithHueRotateExample.title = 'Merge with SourceGraphic and HueRotate';

const icon = (
  <Svg height="30" width="30" viewBox="0 0 20 20">
    <Filter id="mergeWithOffsetIcon" width="180" height="180">
      <FeOffset dx="5" dy="5" />
      <FeMerge>
        <FeMergeNode />
        <FeMergeNode in="SourceGraphic" />
      </FeMerge>
    </Filter>
    <Rect
      x="1"
      y="1"
      width="13"
      height="13"
      fill="blue"
      filter="url(#mergeWithOffsetIcon)"
      strokeWidth="1"
      stroke="black"
    />
  </Svg>
);
const samples = [WithOffsetsExample, WithHueRotateExample];

export {icon, samples};

import React from 'react';
import {Polyline, Svg} from 'react-native-svg';

function PolylineExample() {
  return (
    <Svg height="100" width="100">
      <Polyline
        points="10 10 20 12 30 20 40 60 60 70 95 90"
        fill="none"
        stroke="black"
        strokeWidth="3"
      />
    </Svg>
  );
}
PolylineExample.title =
  'The <Polyline> element is used to create any shape that consists of only straight lines';

function StraightLines() {
  return (
    <Svg height="100" width="100">
      <Polyline
        points="0,20 20,20 20,40 40,40 40,60 60,60 60,80"
        fill="none"
        stroke="red"
        strokeWidth="2"
      />
    </Svg>
  );
}
StraightLines.title = 'Another example with only straight lines';

function PolylineFill() {
  return (
    <Svg height="100" width="100">
      <Polyline
        points="10,10 20,12 30,20 40,60 60,70 95,90"
        fill="red"
        stroke="black"
        strokeWidth="3"
      />
    </Svg>
  );
}
PolylineFill.title = 'Fill Polyline';

function PolylineFillStroke() {
  return (
    <Svg height="100" width="100">
      <Polyline
        points="10,10 30,10 30,60 60,70 95,90"
        fill="none"
        stroke="blue"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
PolylineFillStroke.title =
  'Stroke Polyline with strokeLinecap and strokeLinejoin';

const icon = (
  <Svg height="30" width="30" viewBox="0 0 20 20">
    <Polyline
      points="2,2 4,2.5 6,4 8,12 12,14 20,18"
      fill="none"
      stroke="black"
      strokeWidth="1"
    />
  </Svg>
);

const samples = [
  PolylineExample,
  StraightLines,
  PolylineFill,
  PolylineFillStroke,
];

export {icon, samples};

import React from 'react';
import {Circle, Svg} from 'react-native-svg';

function CircleExample() {
  return (
    <Svg height="100" width="140">
      <Circle cx="50%" cy="50%" r="40%" fill="pink" />
    </Svg>
  );
}

CircleExample.title = 'Circle';

function StrokeCircle() {
  return (
    <Svg height="100" width="100">
      <Circle
        cx="50"
        cy="50"
        r="45"
        stroke="purple"
        strokeWidth="2.5"
        fill="none"
      />
    </Svg>
  );
}
StrokeCircle.title = 'Stroke Circle';

function StrokeOpacityCircle() {
  return (
    <Svg height="100" width="100">
      <Circle
        cx="50"
        cy="50"
        r="40"
        stroke="purple"
        strokeOpacity="0.5"
        strokeWidth="10"
        fill="pink"
      />
    </Svg>
  );
}
StrokeOpacityCircle.title = 'Circle with strokeOpacity';

function PieCircle() {
  return (
    <Svg height="100" width="100">
      <Circle cx="50" cy="50" r="40" fill="#ddd" />
      <Circle
        origin="50, 50"
        rotation="-90"
        cx="50"
        cy="50"
        r="20"
        stroke="#0074d9"
        strokeWidth="40"
        fill="none"
        strokeDasharray="80, 160"
      />
    </Svg>
  );
}
PieCircle.title = 'Draw a Pie shape with circle';

const icon = (
  <Svg height="30" width="30" viewBox="0 0 20 20">
    <Circle cx="10" cy="10" r="8" stroke="purple" strokeWidth="1" fill="pink" />
  </Svg>
);
const samples = [CircleExample, StrokeCircle, StrokeOpacityCircle, PieCircle];

export {icon, samples};

import React, { Component } from 'react';
import {
  Svg,
  Circle,
  Ellipse,
  G,
  Text,
  TSpan,
  TextPath,
  Path,
  Polygon,
  Polyline,
  Line,
  Rect,
  Use,
  Image,
  Symbol,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  ClipPath,
  Pattern,
  Mask,
  Marker,
} from '../Svg';

class CircleExample extends Component {
  static title = 'Circle';
  render() {
    return (
      <Svg height="100" width="140">
        <Circle cx="50%" cy="50%" r="40%" fill="pink" />
      </Svg>
    );
  }
}

class StrokeCircle extends Component {
  static title = 'Stroke Circle';
  render() {
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
}

class StrokeOpacityCircle extends Component {
  static title = 'Circle with strokeOpacity';
  render() {
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
}

class PieCircle extends Component {
  static title = 'Draw a Pie shape with circle';
  render() {
    return (
      <Svg height="100" width="100">
        <Circle cx="50" cy="50" r="40" fill="#ddd" />
        <Circle
          origin="50, 50"
          rotate="-90"
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
}

const icon = (
  <Svg height="30" width="30" viewBox="0 0 20 20">
    <Circle cx="10" cy="10" r="8" stroke="purple" strokeWidth="1" fill="pink" />
  </Svg>
);

const samples = [CircleExample, StrokeCircle, StrokeOpacityCircle, PieCircle];
export { icon, samples };

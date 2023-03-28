import React, {Component} from 'react';
import {
  Svg,
  Circle,
  Defs,
  Marker,
  Rect,
  Ellipse,
  Line,
  Polygon,
} from 'react-native-svg';

class CircleExample extends Component {
  static title = 'Circle shaped marker on ellipse';
  render() {
    return (
      <Svg height="300" width="400">
        <Defs>
          <Marker
            id="selection"
            markerUnits="userSpaceOnUse"
            refX="0"
            refY="0"
            orient="auto">
            <Circle
              fill="#3a6cff"
              r={5}
              cx={0}
              cy={0}
              strokeWidth={1}
              stroke="white"
            />
          </Marker>
        </Defs>
        <Ellipse
          cx="200"
          cy="170"
          rx="30%"
          ry="10%"
          stroke="purple"
          strokeWidth="2"
          fill="yellow"
          marker="url(#selection)"
        />
      </Svg>
    );
  }
}

class StrokeCircle extends Component {
  static title = 'Triangle shaped marker on line';
  render() {
    return (
      <Svg height="200" width="200">
        <Defs>
          <Marker
            id="selection"
            markerUnits="userSpaceOnUse"
            refX="0"
            refY="0"
            orient="auto">
            <Polygon
              points="0,0 -5,20 10,30"
              fill="lime"
              stroke="purple"
              strokeWidth="1"
            />
          </Marker>
        </Defs>
        <Line
          x1="20"
          y1="10%"
          x2="60%"
          y2="60%"
          stroke="red"
          strokeWidth="2"
          marker="url(#selection)"
        />
      </Svg>
    );
  }
}

class StrokeOpacityCircle extends Component {
  static title = 'Rect shaped marker on circle';
  render() {
    return (
      <Svg height="150" width="200">
        <Defs>
          <Marker
            id="selection"
            markerUnits="userSpaceOnUse"
            refX="0"
            refY="0"
            orient="auto">
            <Rect x="0" y="0" width="15" height="15" fill="rgb(0,0,255)" />
          </Marker>
        </Defs>
        <Circle
          cx="70"
          cy="70"
          r="30%"
          stroke="purple"
          strokeOpacity="0.5"
          strokeWidth="10"
          fill="pink"
          marker="url(#selection)"
        />
      </Svg>
    );
  }
}

class PieCircle extends Component {
  static title = 'Ellipse shaped marker on rect';
  render() {
    return (
      <Svg width="400" height="200" viewBox="0 0 100 100">
        <Defs>
          <Marker
            id="selection"
            markerUnits="userSpaceOnUse"
            refX="0"
            refY="0"
            orient="auto">
            <Ellipse
              fill="#3a6cff"
              rx={5}
              ry={8}
              cx={0}
              cy={0}
              strokeWidth={1}
              stroke="white"
            />
          </Marker>
        </Defs>
        <Rect
          x="50%"
          y="50"
          width="30"
          height="30"
          fill="none"
          stroke="blue"
          strokeWidth="5"
          marker="url(#selection)"
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
export {icon, samples};

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
  Path,
} from 'react-native-svg';

class EllipseExample extends Component {
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

class LineExample extends Component {
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

class CircleExample extends Component {
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

class RectExample extends Component {
  static title = 'Ellipse shaped marker on rect';
  render() {
    return (
      <Svg width="400" height="200" viewBox="0 0 100 100">
        <Defs>
          <Marker
            id="selection"
            markerUnits="strokeWidth"
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
          strokeWidth="1"
          marker="url(#selection)"
        />
      </Svg>
    );
  }
}

class PathExample extends Component {
  static title = 'Path shaped marker on line';
  render() {
    return (
      <Svg height="200" width="400" viewBox="0 0 300 100">
        <Defs>
          <Marker
            id="arrow"
            // viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            // orient="auto-start-reverse"
          >
            <Path fill="blue" d="M 0 0 L 10 5 L 0 10 z" />
          </Marker>
        </Defs>
        <Line
          x1="10"
          y1="10"
          x2="90"
          y2="90"
          stroke="black"
          strokeWidth="3"
          markerEnd="url(#arrow)"
        />
      </Svg>
    );
  }
}

const icon = (
  <Svg height="30" width="30" viewBox="0 0 3000 2500">
    <Defs>
      <Marker
        id="Triangle"
        // viewBox="0 0 10 10"
        refX="0"
        refY="5"
        markerUnits="strokeWidth"
        markerWidth="4"
        markerHeight="3"
        orient="auto">
        <Path fill="blue" d="M 0 0 L 10 5 L 0 10 z" />
      </Marker>
    </Defs>
    <Path
      d="M 1000 750 L 2000 750 L 2500 1250"
      fill="none"
      stroke="black"
      strokeWidth="70"
      markerEnd="url(#Triangle)"
      markerStart="url(#Triangle)"
    />
  </Svg>
);

const samples = [
  EllipseExample,
  LineExample,
  CircleExample,
  RectExample,
  PathExample,
];
export {icon, samples};

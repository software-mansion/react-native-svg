import React, {Component} from 'react';
import {Svg, Rect} from 'react-native-svg';

class RectExample extends Component {
  static title = 'Rect';
  render() {
    return (
      <Svg width="200" height="60">
        <Rect
          x="5%"
          y="5%"
          width="90%"
          height="90%"
          fill="rgb(0,0,255)"
          strokeWidth="3"
          stroke="rgb(0,0,0)"
          strokeDasharray="5,10"
        />
      </Svg>
    );
  }
}

class RectStrokeFill extends Component {
  static title = '`stroke` and `fill` Rect';
  render() {
    return (
      <Svg width="100" height="100">
        <Rect
          x="20"
          y="20"
          width="75"
          height="75"
          fill="blue"
          fillOpacity="0.5"
          stroke="red"
          strokeWidth="5"
          strokeOpacity="0.5"
        />
      </Svg>
    );
  }
}

class RoundedRect extends Component {
  static title = 'A rectangle with rounded corners';
  render() {
    return (
      <Svg width="100" height="100">
        <Rect
          x="20"
          y="20"
          rx="20"
          ry="20"
          width="75"
          height="75"
          fill="blue"
          stroke="pink"
          strokeWidth="5"
        />
      </Svg>
    );
  }
}

class EllipseRect extends Component {
  static title = 'Rect with different `rx` and `ry`';
  render() {
    return (
      <Svg width="100" height="100">
        <Rect
          x="20"
          y="20"
          rx="40"
          ry="20"
          width="75"
          height="75"
          fill="blue"
          stroke="pink"
          strokeWidth="5"
        />
      </Svg>
    );
  }
}

class RoundOverflowRect extends Component {
  static title = 'Rect with `rx` or `ry` overflowed';
  render() {
    return (
      <Svg width="100" height="100">
        <Rect
          x="20"
          y="20"
          ry="40"
          width="75"
          height="75"
          fill="blue"
          stroke="pink"
          strokeWidth="5"
        />
      </Svg>
    );
  }
}

const icon = (
  <Svg height="30" width="30" viewBox="0 0 20 20">
    <Rect
      x="3"
      y="5"
      width="14"
      height="10"
      fill="rgb(0,0,255)"
      strokeWidth="2"
      stroke="rgb(255,0,0)"
    />
  </Svg>
);

const samples = [
  RectExample,
  RectStrokeFill,
  RoundedRect,
  EllipseRect,
  RoundOverflowRect,
];

export {icon, samples};

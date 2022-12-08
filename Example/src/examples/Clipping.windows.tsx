import React, {Component} from 'react';
import {Svg, G, Text, Rect, Defs, RadialGradient, Stop} from 'react-native-svg';

class ClipPathElement extends Component {
  static title = 'Clip by set clip-path with a path data';
  render() {
    return (
      <Svg height="100" width="100">
        <Defs>
          <RadialGradient
            id="clip-path-grad"
            cx="50%"
            cy="50%"
            rx="50%"
            ry="50%"
            fx="50%"
            fy="50%">
            <Stop offset="0%" stopColor="#ff0" stopOpacity="1" />
            <Stop offset="100%" stopColor="#00f" stopOpacity="1" />
          </RadialGradient>
        </Defs>
        <Rect
          x="0"
          y="0"
          width="100"
          height="100"
          fill="url(#clip-path-grad)"
        />
      </Svg>
    );
  }
}

class ClipRule extends Component {
  static title = 'Clip a group with clipRule="evenodd"';
  render() {
    return (
      <Svg height="100" width="100">
        <Defs></Defs>
        <G clipRule="evenodd">
          <Rect x="0" y="0" width="50" height="50" fill="red" />
          <Rect x="50" y="0" width="50" height="50" fill="blue" />
          <Rect x="0" y="50" width="50" height="50" fill="yellow" />
          <Rect x="50" y="50" width="50" height="50" fill="green" />
        </G>
      </Svg>
    );
  }
}

class TextClipping extends Component {
  static title = 'Transform the text';
  render() {
    return (
      <Svg height="60" width="200">
        <Defs></Defs>
        <Text
          x="100"
          y="40"
          fill="red"
          fontSize="22"
          fontWeight="bold"
          stroke="blue"
          strokeWidth="1"
          textAnchor="middle">
          NOT THE FACE
        </Text>
      </Svg>
    );
  }
}

const icon = (
  <Svg height="30" width="30" viewBox="0 0 20 20">
    <G clipRule="evenodd" scale="0.2">
      <Rect x="0" y="0" width="50" height="50" fill="red" />
      <Rect x="50" y="0" width="50" height="50" fill="blue" />
      <Rect x="0" y="50" width="50" height="50" fill="yellow" />
      <Rect x="50" y="50" width="50" height="50" fill="green" />
    </G>
  </Svg>
);

const samples = [ClipPathElement, ClipRule, TextClipping];

export {icon, samples};

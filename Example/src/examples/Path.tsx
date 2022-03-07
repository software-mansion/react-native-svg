import React, {Component} from 'react';
import {Svg, Circle, G, Text, Path} from 'react-native-svg';

class PathExample extends Component {
  static title = 'Path';
  render() {
    return (
      <Svg height="100" width="100">
        <Path d="M50 0 L15 100 L85 100 Z" />
        <Path
          fill="red"
          d="M38.459,1.66A0.884,0.884,0,0,1,39,2.5a0.7,0.7,0,0,1-.3.575L23.235,16.092,27.58,26.1a1.4,1.4,0,0,1,.148.3,1.3,1.3,0,0,1,0,.377,1.266,1.266,0,0,1-2.078.991L15.526,20.6l-7.58,4.35a1.255,1.255,0,0,1-.485,0,1.267,1.267,0,0,1-1.277-1.258q0-.01,0-0.02a1.429,1.429,0,0,1,0-.446C7.243,20.253,8.6,16.369,8.6,16.29L3.433,13.545A0.743,0.743,0,0,1,2.9,12.822a0.822,0.822,0,0,1,.623-0.773l8.164-2.972,3.018-8.5A0.822,0.822,0,0,1,15.427,0a0.752,0.752,0,0,1,.752.555l2.563,6.936S37.65,1.727,37.792,1.685A1.15,1.15,0,0,1,38.459,1.66Z"
        />
        <Path
          fill="blue"
          d="M6.5 1C7.9 1 9 2.1 9 3.5c0 .8-.4 1.6-1.1 2.1-.4.2-.9.4-1.4.4s-1-.2-1.4-.4C4.4 5.1 4 4.3 4 3.5 4 2.1       5.1 1 6.5 1m0-1C4.6 0 3 1.6 3 3.5c0 1.2.6 2.2 1.5 2.9.6.4 1.3.6 2 .6s1.4-.2 2-.6c.9-.7 1.5-1.7 1.5-2.9C10 1.6 8.4 0 6.5 0zm3.6 8.9c.6.8.9 1.7.9 2.6v.5H2v-.5c0-1 .3-1.9.9-2.6 1 .7 2.3 1.1 3.6 1.1s2.6-.4 3.6-1.1m.2-1.4C9.3 8.4 8 9 6.5 9s-2.8-.6-3.8-1.5c-1.1 1-1.7 2.4-1.7 4 0 .5.1 1.5.2 1.5h10.6c.1 0 .2-1 .2-1.5 0-1.6-.7-3-1.7-4z"
        />
      </Svg>
    );
  }
}

class UnclosedPath extends Component {
  static title = 'Unclosed paths';
  render() {
    return (
      <Svg height="100" width="100">
        <Path
          d="M25 10 L98 65 L70 25 L16 77 L11 30 L0 4 L90 50 L50 10 L11 22 L77 95 L20 25"
          fill="none"
          stroke="red"
          strokeWidth="1"
        />
      </Svg>
    );
  }
}

class BezierCurve extends Component {
  static title =
    'The following example creates a quadratic Bézier curve, where A and C are the start and end points, B is the control point';
  render() {
    return (
      <Svg height="200" width="225">
        <G scale="0.5">
          <Path
            d="M 100 350 l 150 -300"
            stroke="red"
            strokeWidth="3"
            fill="none"
          />
          <Path
            d="M 250 50 l 150 300"
            stroke="red"
            strokeWidth="3"
            fill="none"
          />
          <Path
            d="M 175 200 l 150 0"
            stroke="green"
            strokeWidth="3"
            fill="none"
          />
          <Path
            d="M 100 350 q 150 -300 300 0"
            stroke="blue"
            strokeWidth="5"
            fill="none"
          />
          <G stroke="purple" strokeWidth="3" fill="purple">
            <Circle cx="100" cy="350" r="3" />
            <Circle cx="250" cy="50" r="3" />
            <Circle cx="400" cy="350" r="3" />
          </G>
          <G fontSize="30" fill="black" stroke="none" textAnchor="middle">
            <Text x="100" y="350" dx="-30">
              A
            </Text>
            <Text x="250" y="50" dy="-50">
              B
            </Text>
            <Text x="400" y="350" dx="10">
              C
            </Text>
          </G>
        </G>
      </Svg>
    );
  }
}
const icon = (
  <Svg height="30" width="30" viewBox="0 0 20 20">
    <Path
      d="M5 0 L8 10 L10 15 L18 2 L4 18 L5 14 L10 10 Z"
      stroke="red"
      fill="none"
    />
  </Svg>
);

const samples = [PathExample, UnclosedPath, BezierCurve];

export {icon, samples};

import React, {Component} from 'react';
import {Platform} from 'react-native';

import {
  Svg,
  Circle,
  Rect,
  Pattern,
  RadialGradient,
  Stop,
  SvgXml,
} from 'react-native-svg';

const patternXml = `
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
<!-- Apply a transform on the tile -->
<pattern
  id="p1"
  width=".25"
  height=".25"
  patternTransform="rotate(20)
                    skewX(30)
                    scale(1 0.5)">
  <circle cx="10" cy="10" r="10" fill="black" />
</pattern>

<rect x="10" y="10" width="80" height="80" fill="url(#p1)" />
</svg>
`;

class PatternTransformExample extends Component {
  static title = 'Pattern transform';
  render() {
    return (
      <>
        <Svg height="100" width="300" viewBox="0 0 200 100">
          <Pattern
            id="p1"
            width="0.25"
            height="0.25"
            patternTransform={[
              {rotate: '20'},
              {skewX: '30'},
              {scaleX: 1},
              {scaleY: 0.5},
            ]}>
            <Circle fill="black" cx="10" cy="10" r="10" />
          </Pattern>
          <Pattern
            id="p2"
            width="0.25"
            height="0.25"
            patternTransform="rotate(20) skewX(30) scale(1 0.5)">
            <Circle fill="black" cx="10" cy="10" r="10" />
          </Pattern>
          <Rect x="10" y="10" width="80" height="80" fill="url(#p1)" />
          <Rect
            x="10"
            y="10"
            width="80"
            height="80"
            fill="url(#p2)"
            transform={[{translateX: 100}]}
          />
        </Svg>
        {Platform.OS !== 'web' && (
          <SvgXml width="100" height="100" xml={patternXml} />
        )}
      </>
    );
  }
}

class GradientTransformExample extends Component {
  static title = 'Gradient transform';
  render() {
    return (
      <Svg height="200" width="300" viewBox="0 0 420 200">
        <RadialGradient
          id="gradient1"
          gradientUnits="userSpaceOnUse"
          cx="100"
          cy="100"
          r="100"
          fx="100"
          fy="100">
          <Stop offset="0%" stopColor="darkblue" />
          <Stop offset="50%" stopColor="skyblue" />
          <Stop offset="100%" stopColor="darkblue" />
        </RadialGradient>
        <RadialGradient
          id="gradient2"
          gradientUnits="userSpaceOnUse"
          cx="100"
          cy="100"
          r="100"
          fx="100"
          fy="100"
          gradientTransform="skewX(20) translate(-35, 0)">
          <Stop offset="0%" stopColor="darkblue" />
          <Stop offset="50%" stopColor="skyblue" />
          <Stop offset="100%" stopColor="darkblue" />
        </RadialGradient>

        <Rect x="0" y="0" width="200" height="200" fill="url(#gradient1)" />
        <Rect
          x="0"
          y="0"
          width="200"
          height="200"
          fill="url(#gradient2)"
          transform="translate(220)"
        />
      </Svg>
    );
  }
}

const icon = (
  <Svg height="30" width="30" viewBox="0 0 100 100">
    <Pattern
      id="p1"
      width="0.25"
      height="0.25"
      patternTransform="rotate(20) skewX(30) scale(1 0.5)">
      <Circle fill="black" cx="10" cy="10" r="10" />
    </Pattern>
    <Rect x="10" y="10" width="80" height="80" fill="url(#p1)" />
  </Svg>
);

const samples = [PatternTransformExample, GradientTransformExample];

export {icon, samples};

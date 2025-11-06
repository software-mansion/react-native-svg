import * as React from 'react';
import {View} from 'react-native';
import {
  Circle,
  RadialGradient,
  Rect,
  Stop,
  Svg,
  SvgXml,
} from 'react-native-svg';

// https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/r#example
const svgXml = `
<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
  <radialGradient r="0" id="myGradient000">
    <stop offset="0" stop-color="white" />
    <stop offset="100%" stop-color="black" />
  </radialGradient>
  <radialGradient r="50%" id="myGradient050">
    <stop offset="0" stop-color="white" />
    <stop offset="100%" stop-color="black" />
  </radialGradient>
  <radialGradient r="100%" id="myGradient100">
    <stop offset="0" stop-color="white" />
    <stop offset="100%" stop-color="black" />
  </radialGradient>

  <circle cx="50" cy="50" r="0" />
  <circle cx="150" cy="50" r="25" />
  <circle cx="250" cy="50" r="50" />

  <rect x="20" y="120" width="60" height="60" fill="url(#myGradient000)" />
  <rect x="120" y="120" width="60" height="60" fill="url(#myGradient050)" />
  <rect x="220" y="120" width="60" height="60" fill="url(#myGradient100)" />
</svg>
`;

export default function App() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <SvgXml width={400} height={300} xml={svgXml} />
      <Svg width={400} height={300}>
        <RadialGradient id="a" r={0}>
          <Stop offset={0} stopColor="#f00" />
          <Stop offset="50%" stopColor="#0f0" />
          <Stop offset="100%" stopColor="#00f" />
        </RadialGradient>
        <RadialGradient id="b" r="50%">
          <Stop offset={0} stopColor="#f00" />
          <Stop offset="100%" stopColor="#00f" />
        </RadialGradient>
        <RadialGradient id="c" r="100%">
          <Stop offset={0} stopColor="#f00" />
          <Stop offset="100%" stopColor="#00f" />
        </RadialGradient>
        <Rect x={0} y={100} width={100} height={100} fill="url(#a)" />
        <Rect x={150} y={100} width={100} height={100} fill="url(#b)" />
        <Rect x={300} y={100} width={100} height={100} fill="url(#c)" />
        <Circle cx={50} cy={250} r={50} fill="url(#a)" />
        <Circle cx={200} cy={250} r={50} fill="url(#b)" />
        <Circle cx={350} cy={250} r={50} fill="url(#c)" />
      </Svg>
    </View>
  );
}

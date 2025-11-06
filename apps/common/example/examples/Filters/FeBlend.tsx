import React from 'react';
import {
  Circle,
  FeBlend,
  FeFlood,
  Filter,
  G,
  Image,
  LinearGradient,
  Rect,
  Stop,
  Svg,
  Text,
} from 'react-native-svg';

W3Blend.title = 'W3 FeBlend example';
function W3Blend() {
  return (
    <Svg width="350" height="350" viewBox="0 0 500 500">
      <LinearGradient
        id="MyGradient"
        gradientUnits="userSpaceOnUse"
        x1="100"
        y1="0"
        x2="300"
        y2="0">
        <Stop offset="0" stopColor="#000000" />
        <Stop offset="0.33" stopColor="#ffffff" />
        <Stop offset="0.67" stopColor="#ff0000" />
        <Stop offset="1" stopColor="#808080" />
      </LinearGradient>
      <Filter id="Normal">
        <FeBlend mode="normal" in2="BackgroundImage" in="SourceGraphic" />
      </Filter>
      <Filter id="Multiply">
        <FeBlend mode="multiply" in2="BackgroundImage" in="SourceGraphic" />
      </Filter>
      <Filter id="Screen">
        <FeBlend mode="screen" in2="BackgroundImage" in="SourceGraphic" />
      </Filter>
      <Filter id="Darken">
        <FeBlend mode="darken" in2="BackgroundImage" in="SourceGraphic" />
      </Filter>
      <Filter id="Lighten">
        <FeBlend mode="lighten" in2="BackgroundImage" in="SourceGraphic" />
      </Filter>

      <Rect fill="none" stroke="blue" x="1" y="1" width="498" height="498" />
      <G enable-background="new">
        <Rect x="100" y="20" width="300" height="460" fill="url(#MyGradient)" />
        <G fontFamily="Verdana" fontSize="75" fill="#888888" fillOpacity=".6">
          <Text x="50" y="90" filter="url(#Normal)">
            Normal
          </Text>
          <Text x="50" y="180" filter="url(#Multiply)">
            Multiply
          </Text>
          <Text x="50" y="270" filter="url(#Screen)">
            Screen
          </Text>
          <Text x="50" y="360" filter="url(#Darken)">
            Darken
          </Text>
          <Text x="50" y="450" filter="url(#Lighten)">
            Lighten
          </Text>
        </G>
      </G>
    </Svg>
  );
}

SimpleExample.title = 'MDN example';
function SimpleExample() {
  return (
    <Svg width="200" height="200">
      <Filter id="spotlight">
        <FeFlood
          result="floodFill"
          x="0%"
          y="0"
          width="100%"
          height="100%"
          floodColor="green"
          floodOpacity="1"
        />
        <FeBlend in="SourceGraphic" in2="floodFill" mode="multiply" />
      </Filter>

      <Circle cx="50%" cy="50%" r="40%" fill="red" filter="url(#spotlight)" />
    </Svg>
  );
}

MDNExample.title = 'MDN example';
function MDNExample() {
  return (
    <Svg width="200" height="200">
      <Filter id="spotlight">
        <FeFlood
          result="floodFill"
          x="0"
          y="0"
          width="100%"
          height="100%"
          floodColor="green"
          floodOpacity="1"
        />
        <FeBlend in="SourceGraphic" in2="floodFill" mode="multiply" />
      </Filter>
      <Image
        href="https://live.mdnplay.dev/en-US/docs/Web/SVG/Reference/Element/feBlend/mdn_logo_only_color.png"
        x="10%"
        y="10%"
        width="80%"
        height="80%"
        filter="url(#spotlight)"
      />
    </Svg>
  );
}

const icon = (
  <Svg width="30" height="30">
    <Filter id="blendIcon">
      <FeFlood
        result="floodRes"
        x="0%"
        y="0"
        width="100%"
        height="100%"
        floodColor="green"
        floodOpacity="1"
      />
      <FeBlend in="SourceGraphic" in2="floodRes" mode="multiply" />
    </Filter>

    <Circle cx="50%" cy="50%" r="40%" fill="red" filter="url(#blendIcon)" />
  </Svg>
);
const samples = [W3Blend, SimpleExample, MDNExample];

export {icon, samples};

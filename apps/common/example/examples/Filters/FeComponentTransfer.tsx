import React from 'react';
import {
  FeComponentTransfer,
  FeFuncA,
  FeFuncB,
  FeFuncG,
  FeFuncR,
  Filter,
  G,
  LinearGradient,
  Rect,
  Stop,
  Svg,
  Text,
} from 'react-native-svg';

BasicMDN.title = 'Basic MDN example';
function BasicMDN() {
  return (
    <Svg width="350" height="320">
      <LinearGradient
        id="rainbow"
        gradientUnits="userSpaceOnUse"
        x1="0"
        y1="0"
        x2="100%"
        y2="0">
        <Stop offset="0" stopColor="red" />
        <Stop offset="0.2" stopColor="yellow" />
        <Stop offset="0.4" stopColor="lime" />
        <Stop offset="0.6" stopColor="cyan" />
        <Stop offset="0.8" stopColor="blue" />
        <Stop offset="1" stopColor="purple" />
      </LinearGradient>
      <Filter id="identity">
        <FeComponentTransfer>
          <FeFuncR type="identity" />
          <FeFuncG type="identity" />
          <FeFuncB type="identity" />
          <FeFuncA type="identity" />
        </FeComponentTransfer>
      </Filter>

      <Filter id="table">
        <FeComponentTransfer>
          <FeFuncR type="table" tableValues="0 0 1 1" />
          <FeFuncG type="table" tableValues="1 1 0 0" />
          <FeFuncB type="table" tableValues="0 1 1 0" />
        </FeComponentTransfer>
      </Filter>

      <Filter id="discrete">
        <FeComponentTransfer>
          <FeFuncR type="discrete" tableValues="0 0 1 1" />
          <FeFuncG type="discrete" tableValues="1 1 0 0" />
          <FeFuncB type="discrete" tableValues="0 1 1 0" />
        </FeComponentTransfer>
      </Filter>
      <Filter id="linear">
        <FeComponentTransfer>
          <FeFuncR type="linear" slope="0.5" intercept="0" />
          <FeFuncG type="linear" slope="0.5" intercept="0.25" />
          <FeFuncB type="linear" slope="0.5" intercept="0.5" />
        </FeComponentTransfer>
      </Filter>
      <Filter id="gamma">
        <FeComponentTransfer>
          <FeFuncR type="gamma" amplitude="4" exponent="7" offset="0" />
          <FeFuncG type="gamma" amplitude="4" exponent="4" offset="0" />
          <FeFuncB type="gamma" amplitude="4" exponent="1" offset="0" />
        </FeComponentTransfer>
      </Filter>
      <G>
        <Text x="0" y="20">
          Default
        </Text>
        <Rect x="0" y="30" width="100%" height="20" fill="url(#rainbow)" />
        <Text x="0" y="70">
          Identity
        </Text>
        <Rect
          x="0"
          y="80"
          width="100%"
          height="20"
          filter="url(#identity)"
          fill="url(#rainbow)"
        />
        <Text x="0" y="120">
          Table lookup
        </Text>
        <Rect
          x="0"
          y="130"
          width="100%"
          height="20"
          filter="url(#table)"
          fill="url(#rainbow)"
        />
        <Text x="0" y="170">
          Discrete table lookup
        </Text>
        <Rect
          x="0"
          y="180"
          width="100%"
          height="20"
          filter="url(#discrete)"
          fill="url(#rainbow)"
        />
        <Text x="0" y="220">
          Linear function
        </Text>
        <Rect
          x="0"
          y="230"
          width="100%"
          height="20"
          filter="url(#linear)"
          fill="url(#rainbow)"
        />
        <Text x="0" y="270">
          Gamma function
        </Text>
        <Rect
          x="0"
          y="280"
          width="100%"
          height="20"
          filter="url(#gamma)"
          fill="url(#rainbow)"
        />
      </G>
    </Svg>
  );
}

W3CExample.title = 'W3C example';
function W3CExample() {
  return (
    <Svg width="400" height="200" viewBox="0 0 800 400">
      <LinearGradient
        id="MyGradient"
        gradientUnits="userSpaceOnUse"
        x1="100"
        y1="0"
        x2="600"
        y2="0">
        <Stop offset="0" stopColor="#ff0000" />
        <Stop offset="0.33" stopColor="#00ff00" />
        <Stop offset="0.67" stopColor="#0000ff" />
        <Stop offset="1" stopColor="#000000" />
      </LinearGradient>
      <Filter id="Identity" filterUnits="objectBoundingBox">
        <FeComponentTransfer>
          <FeFuncR type="identity" />
          <FeFuncG type="identity" />
          <FeFuncB type="identity" />
          <FeFuncA type="identity" />
        </FeComponentTransfer>
      </Filter>
      <Filter id="Table" filterUnits="objectBoundingBox">
        <FeComponentTransfer>
          <FeFuncR type="table" tableValues="0 0 1 1" />
          <FeFuncG type="table" tableValues="1 1 0 0" />
          <FeFuncB type="table" tableValues="0 1 1 0" />
        </FeComponentTransfer>
      </Filter>
      <Filter id="Linear" filterUnits="objectBoundingBox">
        <FeComponentTransfer>
          <FeFuncR type="linear" slope="0.5" intercept="0.25" />
          <FeFuncG type="linear" slope="0.5" intercept="0" />
          <FeFuncB type="linear" slope="0.5" intercept="0.5" />
        </FeComponentTransfer>
      </Filter>
      <Filter id="Gamma" filterUnits="objectBoundingBox">
        <FeComponentTransfer>
          <FeFuncR type="gamma" amplitude="2" exponent="5" offset="0" />
          <FeFuncG type="gamma" amplitude="2" exponent="3" offset="0" />
          <FeFuncB type="gamma" amplitude="2" exponent="1" offset="0" />
        </FeComponentTransfer>
      </Filter>
      <Rect fill="none" stroke="blue" x="1" y="1" width="798" height="398" />
      <G
        fontFamily="Verdana"
        fontSize="75"
        fontWeight="bold"
        fill="url(#MyGradient)">
        <Rect x="100" y="0" width="600" height="20" />
        <Text x="100" y="90">
          Identity
        </Text>
        <Text x="100" y="190" filter="url(#Table)">
          TableLookup
        </Text>
        <Text x="100" y="290" filter="url(#Linear)">
          LinearFunc
        </Text>
        <Text x="100" y="390" filter="url(#Gamma)">
          GammaFunc
        </Text>
      </G>
    </Svg>
  );
}

const icon = (
  <Svg width="30" height="30" viewBox="0 0 800 400">
    <LinearGradient
      id="MyGradient"
      gradientUnits="userSpaceOnUse"
      x1="100"
      y1="0"
      x2="600"
      y2="0">
      <Stop offset="0" stopColor="#ff0000" />
      <Stop offset="0.33" stopColor="#00ff00" />
      <Stop offset="0.67" stopColor="#0000ff" />
      <Stop offset="1" stopColor="#000000" />
    </LinearGradient>

    <Rect
      fill="url(#MyGradient)"
      stroke="blue"
      x="1"
      y="1"
      width="798"
      height="398"
    />
  </Svg>
);
const samples = [BasicMDN, W3CExample];

export {icon, samples};

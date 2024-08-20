import React from 'react';
import {Svg, Text, TSpan, Defs, Path, TextPath} from 'react-native-svg';

export default function App() {
  return (
    <Svg viewBox="0 0 100 100">
      <Defs>
        <Path
          id="MyPath"
          fill="none"
          stroke="red"
          d="M10,90 Q90,90 90,45 Q90,10 50,10 Q10,10 10,40 Q10,70 45,70 Q70,70 75,50"
        />
      </Defs>
      <Text x={20} y={40}>
        <TextPath href="#MyPath" textLength="100%">
          Quick brown fox jumps over the lazy dog.
        </TextPath>
      </Text>

      <Text textLength="6em">Small text length</Text>
      <Text y="10" textLength="120%">
        Big text length
      </Text>

      <TSpan y="30" textLength="10em">
        Small text length
      </TSpan>
      <TSpan y="40" textLength="90%">
        Big text length
      </TSpan>
    </Svg>
  );
}

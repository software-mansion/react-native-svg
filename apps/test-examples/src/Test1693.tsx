import React from 'react';
import {View} from 'react-native';
import {Defs, G, Path, Svg, Text, TextPath, TSpan} from 'react-native-svg';

export default function App() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Svg viewBox="0 -50 200 200">
        <Text x="0" textLength="6em">
          Text length 6em
        </Text>
        <Text x="0" y="15" textLength="18em">
          Text length 18em
        </Text>
        <Text>
          <TSpan x="0" y="30" textLength="8em">
            Text length 8em
          </TSpan>
        </Text>
        <Text>
          <TSpan x="0" y="45" fontWeight="bold" textLength="10em">
            Text Length 10em
          </TSpan>
        </Text>
        <Defs>
          <Path id="path" d="M10 50 H290" />
        </Defs>
        <G x="-10" y="60">
          <Text fill="blue">
            <TextPath href="#path">
              We go up and down,
              <TSpan fill="red" textLength="15em">
                then up again
              </TSpan>
            </TextPath>
          </Text>
          <Path d="M10 50 H290" stroke="red" strokeWidth="1" />
        </G>
      </Svg>
    </View>
  );
}

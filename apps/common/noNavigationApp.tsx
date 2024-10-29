/**
 * Sample React Native App for react-native-svg library
 * https://github.com/software-mansion/react-native-svg/tree/main/apps/common/example
 */

/**
 * This is a very simple render of the examples for react-native-svg library, to avoid dependencies on @react-navigation,
 * which may not be fully supported on all platforms and versions of react-native
 */
'use strict';

import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {examples} from './example/examples';
import type {Example} from './example/utils/types';
import {commonStyles} from './example/utils/commonStyles';

const ExampleBlock = ({example, index}: {example: Example; index: number}) => {
  if (Array.isArray(example.samples)) {
    return (
      <View
        key={index}
        style={{borderWidth: 1, margin: 15, padding: 15, borderRadius: 5}}>
        {example.icon}
        <View style={[commonStyles.separator, {margin: 10}]} />
        {example.samples.map((sample, index) => {
          return (
            <View key={index} style={{margin: 15}}>
              <Text style={commonStyles.title}>{sample.title}</Text>
              {sample({})}
            </View>
          );
        })}
      </View>
    );
  }

  throw new Error('Unhandled Example type');
};

import {
  Svg,
  Defs,
  LinearGradient,
  Stop,
  Text as TextS,
  G,
  Path,
  Circle,
} from 'react-native-svg';

export default function App() {
  /*
    return (


<Svg height="60" width="200">
<Defs>
  <LinearGradient id="text-fill-grad" x1="0%" y1="0%" x2="100%" y2="0%">
    <Stop offset="0%" stopColor="rgb(255,255,0)" stopOpacity="0.5" />
    <Stop offset="100%" stopColor="red" stopOpacity="1" />
  </LinearGradient>
</Defs>

<TextS
  fill="url(#text-fill-grad)"
  stroke="purple"
  strokeWidth="1"
  fontSize="20"
  fontWeight="bold"
  x="100"
  y="20"
  textAnchor="middle">
  FILL TEXT
</TextS>
</Svg>
    );
    
    */
  /*
    return (
        <Svg height="200" width="225">
        <G scale="0.5">
          <Path
            d="M 100 350 l 150 -300"
            stroke="red"
            strokeWidth="3"
            fill="none"
          />
          <Path d="M 250 50 l 150 300" stroke="red" strokeWidth="3" fill="none" />
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
            <TextS x="250" y="50" dy="-50">
              B
            </TextS>
          </G>
        </G>
      </Svg>
    )
*/
  return (
    <ScrollView>
      {Object.values(examples).map((example, index) => {
        return <ExampleBlock example={example} index={index} key={index} />;
      })}
    </ScrollView>
  );
}

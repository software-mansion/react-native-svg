import React from 'react';
import {View} from 'react-native';
import {Svg, Text} from 'react-native-svg';

export default function Test2976() {
  return (
    <View style={{flex: 1, justifyContent: 'center', paddingHorizontal: 24}}>
      <Svg height="160" width="100%">
        <Text y="45" fontSize={28}>
          System font: The quick brown fox
        </Text>
        <Text y="105" fontFamily="serif" fontSize={28}>
          Serif font: The quick brown fox
        </Text>
      </Svg>
    </View>
  );
}

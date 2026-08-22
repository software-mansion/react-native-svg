import * as React from 'react';
import {Platform, View} from 'react-native';
import {Svg, Text} from 'react-native-svg';

const fallbackFamily =
  Platform.OS === 'ios' || Platform.OS === 'macos'
    ? 'MissingFont, Georgia'
    : 'MissingFont, serif';

export default function Test2974() {
  return (
    <View style={{paddingTop: 60, paddingHorizontal: 16, gap: 16}}>
      <Svg height="50" width="100%">
        <Text y="36" fontSize={28}>
          The quick brown fox
        </Text>
      </Svg>
      <Svg height="50" width="100%">
        <Text
          y="36"
          fontSize={28}
          fontFamily={
            Platform.OS === 'ios' || Platform.OS === 'macos'
              ? 'Georgia'
              : 'serif'
          }>
          The quick brown fox
        </Text>
      </Svg>
      <Svg height="50" width="100%">
        <Text y="36" fontSize={28} fontFamily={fallbackFamily}>
          The quick brown fox
        </Text>
      </Svg>
    </View>
  );
}

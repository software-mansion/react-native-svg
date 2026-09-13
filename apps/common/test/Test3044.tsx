import * as React from 'react';
import {View} from 'react-native';
import Svg, {G, Text} from 'react-native-svg';

// Both rows must render at 24px in Menlo and centred on x=100. Before the fix
// only the second row did, because Svg dropped the individual font props.
export default function Test3044() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Svg
        width="200"
        height="120"
        viewBox="0 0 200 120"
        fontSize={24}
        fontFamily="Menlo"
        textAnchor="middle">
        <Text x="100" y="40">
          on Svg
        </Text>
        <G fontSize={24} fontFamily="Menlo" textAnchor="middle">
          <Text x="100" y="90">
            on G
          </Text>
        </G>
      </Svg>
    </View>
  );
}

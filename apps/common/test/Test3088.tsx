import * as React from 'react';
import {Text, View} from 'react-native';
import Svg, {Circle} from 'react-native-svg';

// On web, the console should stay free of "Unknown event handler property" errors.
export default function Test3088() {
  const [presses, setPresses] = React.useState(0);
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Pressed {presses} times</Text>
      <Svg width="100" height="100">
        <Circle
          cx="50"
          cy="50"
          r="40"
          fill="tomato"
          onPress={() => setPresses(count => count + 1)}
        />
      </Svg>
    </View>
  );
}

import * as React from 'react';
import {Text, View} from 'react-native';
import Svg, {Rect} from 'react-native-svg';

export default function Test3086() {
  const [presses, setPresses] = React.useState(0);
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Pressed {presses} times</Text>
      <Svg width="100" height="100">
        <Rect
          width="100"
          height="100"
          fill="tomato"
          onPress={() => setPresses(count => count + 1)}
        />
      </Svg>
    </View>
  );
}

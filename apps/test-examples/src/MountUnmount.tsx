import React from 'react';
import {Button, Text, View} from 'react-native';
import {Rect, Svg} from 'react-native-svg';

export default () => {
  const [show, setShow] = React.useState(true);
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Blue rect is mounted: {show ? 'true' : 'false'}</Text>

      <Svg height="300" width="300">
        <Rect
          x="0"
          y="0"
          width="300"
          height="300"
          fill="transparent"
          stroke="red"
          strokeWidth={3}
        />
        {show ? (
          <Rect x="100" y="100" width="100" height="100" fill="blue" />
        ) : null}
      </Svg>
      <Button title="Toggle" onPress={() => setShow(!show)} />
    </View>
  );
};

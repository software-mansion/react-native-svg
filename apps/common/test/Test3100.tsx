import * as React from 'react';
import {Button, View} from 'react-native';
import {Path, Svg} from 'react-native-svg';

// The path should turn black when `color` is unset, as on mount, not transparent.
export default function Test3100() {
  const [color, setColor] = React.useState<string | undefined>('red');

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Svg width="100" height="100" viewBox="0 0 100 100" color={color}>
        <Path d="M10 10h80v80H10z" fill="currentColor" />
      </Svg>
      <Button
        title={color ? 'Unset color' : 'Set color to red'}
        onPress={() => setColor(color ? undefined : 'red')}
      />
    </View>
  );
}

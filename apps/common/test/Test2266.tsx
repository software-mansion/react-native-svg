import React, {useState} from 'react';
import {Button, View} from 'react-native';
import {Circle, Svg} from 'react-native-svg';

export default () => {
  const [strokeWidth, setStrokeWidth] = useState<undefined | number>(undefined);
  return (
    <View>
      <Svg viewBox="0 0 30 10" width={400} height={200}>
        <Circle cx="5" cy="5" r="3" stroke="green" />
        <Circle cx="15" cy="5" r="3" stroke="green" strokeWidth="3" />
        <Circle cx="25" cy="5" r="3" stroke="green" strokeWidth="2%" />
      </Svg>
      <Button
        title="stroke: undefined"
        onPress={() => setStrokeWidth(undefined)}
      />
      <Button title="stroke: 0" onPress={() => setStrokeWidth(0)} />
      <Button title="stroke: 1" onPress={() => setStrokeWidth(1)} />
      <Button title="stroke: 2" onPress={() => setStrokeWidth(2)} />
      <Svg viewBox="0 0 30 10" width={400} height={200}>
        <Circle cx="5" cy="5" r="3" stroke="green" strokeWidth={strokeWidth} />
        <Circle cx="10" cy="5" r="3" stroke="green" />
      </Svg>
    </View>
  );
};

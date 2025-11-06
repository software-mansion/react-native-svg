import React, {useState} from 'react';
import {View, Button, Text} from 'react-native';
import {Svg, Path} from 'react-native-svg';

const PathChangingFillFromValueToUndefined = () => {
  const [fill, setFill] = useState<string | undefined>(undefined);

  const changeFill = () => {
    setFill(prevFill => (prevFill ? undefined : 'red'));
  };

  return (
    <View
      style={{
        width: 200,
        margin: 50,
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text>Path which on a button click sets or resets fill to undefined</Text>
      <Button onPress={changeFill} title="Change fill" />
      <Svg height="100" width="100">
        <Path
          d="M25 10 L98 65 L70 25 L16 77 L11 30 L0 4 L90 50 L50 10 L11 22 L77 95 L20 25"
          fill={fill}
        />
      </Svg>
    </View>
  );
};

const PathChangingFillFromValueToFillNone = () => {
  const [fill, setFill] = useState<string | 'none'>('none');

  const changeFill = () => {
    setFill(prevFill => (prevFill !== 'none' ? 'none' : 'red'));
  };

  return (
    <View
      style={{
        width: 200,
        margin: 50,
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text>
        Path which on a button click sets or resets fill to none value
      </Text>
      <Button onPress={changeFill} title="Change fill" />
      <Svg height="100" width="100">
        <Path
          d="M25 10 L98 65 L70 25 L16 77 L11 30 L0 4 L90 50 L50 10 L11 22 L77 95 L20 25"
          fill={fill}
        />
      </Svg>
    </View>
  );
};

export default function App() {
  return (
    <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
      <PathChangingFillFromValueToUndefined />
      <PathChangingFillFromValueToFillNone />
    </View>
  );
}

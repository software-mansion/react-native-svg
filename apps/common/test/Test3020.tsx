import React, {useState} from 'react';
import {Button, Text, View} from 'react-native';
import Svg, {Circle} from 'react-native-svg';

type Mode = 'dashed' | 'omitted' | 'none';

export default function Test3020() {
  const [mode, setMode] = useState<Mode>('dashed');

  const nextMode = () => {
    setMode(current =>
      current === 'dashed'
        ? 'omitted'
        : current === 'omitted'
        ? 'none'
        : 'dashed',
    );
  };

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Svg width={180} height={180}>
        {mode === 'dashed' ? (
          <Circle
            cx={90}
            cy={90}
            r={70}
            stroke="#888888"
            strokeWidth={10}
            fill="none"
            strokeDasharray="1 6"
          />
        ) : mode === 'none' ? (
          <Circle
            cx={90}
            cy={90}
            r={70}
            stroke="#22aa77"
            strokeWidth={10}
            fill="none"
            strokeDasharray="none"
          />
        ) : (
          <Circle
            cx={90}
            cy={90}
            r={70}
            stroke="#2277aa"
            strokeWidth={10}
            fill="none"
          />
        )}
      </Svg>
      <Text>{mode}</Text>
      <Button title="Change stroke dasharray" onPress={nextMode} />
    </View>
  );
}

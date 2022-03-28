import React from 'react';
import { Text } from 'react-native';
import {Circle, Svg} from 'react-native-svg';

export default () => {
  return (
    <>
      <Svg viewBox='100 100 0 0' height={100} width={100} backgroundColor="red">
        <Circle
            cx={50}
            cy={50}
            r={45}
          />
      </Svg>
      <Text>TEST</Text>
    </>
  );
}
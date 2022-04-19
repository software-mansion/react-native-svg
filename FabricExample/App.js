import React from 'react';
import { Text } from 'react-native';
import {Circle, Svg} from 'react-native-svg';

export default () => {
  return (
    <>
      <Svg height={100} width={140} >
        <Circle
            cx={50}
            cy={50}
            r={45}
            fill="pink"
          />
      </Svg>
      <Text>TEST</Text>
    </>
  );
}
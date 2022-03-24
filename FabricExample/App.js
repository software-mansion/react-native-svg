import React from 'react';
import {Svg, Circle,} from 'react-native-svg';

export default () => {
  return (
    <>
      <Svg height="100" width="100">
        <Circle
          cx="50"
          cy="50"
          r={test}
          strokeWidth="2.5"
          fill="blue"
        />
      </Svg>
    </>
  );
}
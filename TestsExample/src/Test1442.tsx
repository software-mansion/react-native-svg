import React from 'react';
import {Svg, Image} from 'react-native-svg';

export function Test1442() {
  return (
    <Svg>
      <Image
        opacity="1"
        width={100}
        height={100}
        href={'https://static.thenounproject.com/png/1563361-200.png'}
        clipPath="url(#clip)"
        onLoad={e => console.log('load', e.nativeEvent)}
      />
    </Svg>
  );
}

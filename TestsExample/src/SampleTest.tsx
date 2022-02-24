import React from 'react';
import { PlatformColor, Platform, Button } from 'react-native';
import {
  Svg,
  Circle,
  Rect,
  Text,
  TSpan
} from 'react-native-svg';

const color = PlatformColor(Platform.select({
  ios: 'label',
  android: '@android:color/primary_text_light',
  default: 'black',
}))

export default () => {
  const [test, setTest] = React.useState(50);

  return (
    <>
      <Svg height="100" width="100" color={color}>
        <Circle
          cx="50"
          cy="50"
          r={test}
          strokeWidth="2.5"
          fill={color}
        />
        <Rect
          x="15"
          y="15"
          width="70"
          height="70"
          stroke="currentColor"
          strokeWidth="5"
        />
      </Svg>
      <Svg height="300" width="300" fill="red">
        <Text x={0} y={0} fontSize={20}>
          <TSpan dx={test} inlineSize={"100%"} fill="currentColor">
          Testing word-wrap... Testing word-wrap... Testing word-wrap... Testing word-wrap...
          </TSpan>
        </Text>
      </Svg>
      <Button title="Click me" onPress={()=> setTest(test + 1)}/>
    </>
  );
}
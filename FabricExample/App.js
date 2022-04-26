import React from 'react';
import {Circle, Svg} from 'react-native-svg';
import { PlatformColor, Platform, DynamicColorIOS, Text } from 'react-native';

const color = PlatformColor(Platform.select({
  ios: 'systemTealColor',
  android: '@android:color/holo_blue_bright',
  default: 'black',
}))

// const customContrastDynamicTextColor = DynamicColorIOS({
//   dark: 'purple',//'hsla(360, 40%, 30%, 1.0)',
//   light: 'green',//'#ff00ff55',
//   highContrastDark: 'blue',
//   highContrastLight: 'red',
// });

export default () => {
  return (
    <>
      <Svg height="100" width={140} color='hsla(360, 40%, 30%, 1.0)'>
        <Circle
            cx={50}
            cy="50"
            r={45}
            fill="currentColor"
          />
      </Svg>
      <Text>TEST</Text>
    </>
  );
}
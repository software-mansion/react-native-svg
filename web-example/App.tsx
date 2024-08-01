import App from '../apps/examples';

import React, { Component } from 'react';
import {
  Svg,
  Circle,
  G,
  Text,
  Path,
  Rect,
  Defs,
  ClipPath,
} from 'react-native-svg';
import { View } from 'react-native';

class PressExample extends Component {
  static title =
    'Press on the red circle or long press on the blue rectangle to trigger the events';

  render() {
    return (
      <View>
        <View></View>
        <Svg height="100" width="100">
          <Circle
            cx="50%"
            cy="50%"
            r="38%"
            fill="red"
            onPress={() => console.log('Press on Circle')}
          />
          <Rect
            x="20%"
            y="20%"
            width="60%"
            height="60%"
            fill="blue"
            onLongPress={() => console.log('Long press on Rect')}
          />
          <Path d="M50,5L20,99L95,39L5,39L80,99z" fill="pink" />
        </Svg>
      </View>
    );
  }
}

export default PressExample;

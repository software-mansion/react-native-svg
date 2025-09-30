import React from 'react';
import {View} from 'react-native';
import {Defs, G, Rect, Svg, Use} from 'react-native-svg';

export default () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Svg width="100" height="100" viewBox="0 0 100 100" color="red">
        {/* @ts-ignore */}
        <Defs color="blue">
          <G color="green">
            <Rect
              id="a"
              x="0"
              y="0"
              width="50"
              height="50"
              fill="currentColor"
            />
          </G>
        </Defs>
        <G color="pink">
          <Use href="#a" />
        </G>
        <Use href="#a" transform="translate(25 25)" />
        <G color="green">
          <Use href="#a" transform="translate(50 50)" />
        </G>
      </Svg>
    </View>
  );
};

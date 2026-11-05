import * as React from 'react';
import {Text, View} from 'react-native';
import Svg, {Image} from 'react-native-svg';

export default function Test3087() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Image from a required asset</Text>
      <Svg width="100" height="100">
        <Image width="100" height="100" href={require('./assets/arrow.png')} />
      </Svg>
    </View>
  );
}

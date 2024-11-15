import React from 'react';
import {StyleSheet, Text} from 'react-native';

function ReanimatedRectExample() {
  return (
    <Text>
      Reanimated not supported in react-native-windows new arch currently
    </Text>
  );
}
ReanimatedRectExample.title = 'reanimated rectangle';

const title = 'Reanimated';
const samples = [ReanimatedRectExample];

const style = StyleSheet.create({text: {width: 30, height: 30}});
const icon = <Text style={style.text}>R</Text>;

export {icon, samples};

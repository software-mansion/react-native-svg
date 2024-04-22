import React, {useEffect} from 'react';
import {StyleSheet, Text} from 'react-native';
import Reanimated, {
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {Svg, Rect} from 'react-native-svg';

const ReanimatedRect = Reanimated.createAnimatedComponent(Rect);

function ReanimatedRectExample() {
  const height = useSharedValue(10);
  const position = useSharedValue(0);

  useEffect(() => {
    height.value = withRepeat(withSpring(100), -1, true);
    position.value = withRepeat(withTiming(300, {duration: 5000}), -1);
  });
  const animatedProps = useAnimatedProps(() => ({
    width: 30,
    height: height.value,
    x: position.value,
    y: 20,
  }));

  return (
    <Svg height="150" width="300">
      <ReanimatedRect animatedProps={animatedProps} fill="red" />
    </Svg>
  );
}
ReanimatedRectExample.title = 'reanimated rectangle';

const samples = [ReanimatedRectExample];

const style = StyleSheet.create({text: {width: 30, height: 30}});
const icon = <Text style={style.text}>R</Text>;

export {icon, samples};

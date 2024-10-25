import React, {useEffect, useRef} from 'react';
import {Animated, Text, View} from 'react-native';
import Reanimated, {
  interpolateColor,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {Circle, Path, Svg} from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedTest = (): JSX.Element => {
  const animColor = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animColor, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animColor, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);
  return (
    <Svg width="100" height="100" viewBox="-4 -4 32 32" fill="none">
      <AnimatedPath
        d="M22.7927 11.1242C21.359 18.5187 12.0003 22.7782 12.0003 22.7782C12.0003 22.7782 2.64153 18.5187 1.20661 11.1242C0.326598 6.58719 2.24925 2.02329 7.13701 2.00007C10.7781 1.98296 12.0003 5.65211 12.0003 5.65211C12.0003 5.65211 13.2226 1.98173 16.8624 2.00007C21.7612 2.02329 23.6727 6.58841 22.7927 11.1242Z"
        strokeWidth="4"
        fill={animColor.interpolate({
          inputRange: [0, 1],
          outputRange: ['red', 'green'],
        })}
        stroke={animColor.interpolate({
          inputRange: [0, 1],
          outputRange: ['blue', 'yellow'],
        })}
      />
      <AnimatedCircle
        cx="20"
        cy="20"
        r="6"
        fill={animColor.interpolate({
          inputRange: [0, 1],
          outputRange: ['blue', 'red'],
        })}
        color={animColor.interpolate({
          inputRange: [0, 1],
          outputRange: ['pink', 'black'],
        })}
        stroke="currentColor"
      />
    </Svg>
  );
};

const ReanimatedPath = Reanimated.createAnimatedComponent(Path);
const ReanimatedCircle = Reanimated.createAnimatedComponent(Circle);
const ReanimatedTest = (): JSX.Element => {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withRepeat(withTiming(1, {duration: 1000}), -1, true);
  }, []);

  const animatedProps = useAnimatedProps(() => ({
    fill: interpolateColor(progress.value, [0, 1], ['red', 'green']),
    stroke: interpolateColor(progress.value, [0, 1], ['blue', 'yellow']),
  }));
  const animatedProps2 = useAnimatedProps(() => ({
    fill: interpolateColor(progress.value, [0, 1], ['blue', 'red']),
    color: interpolateColor(progress.value, [0, 1], ['pink', 'black']),
  }));

  return (
    <Svg width="100" height="100" viewBox="-4 -4 32 32" fill="none">
      <ReanimatedPath
        d="M22.7927 11.1242C21.359 18.5187 12.0003 22.7782 12.0003 22.7782C12.0003 22.7782 2.64153 18.5187 1.20661 11.1242C0.326598 6.58719 2.24925 2.02329 7.13701 2.00007C10.7781 1.98296 12.0003 5.65211 12.0003 5.65211C12.0003 5.65211 13.2226 1.98173 16.8624 2.00007C21.7612 2.02329 23.6727 6.58841 22.7927 11.1242Z"
        strokeWidth="4"
        animatedProps={animatedProps}
      />
      <ReanimatedCircle
        cx="20"
        cy="20"
        r="6"
        animatedProps={animatedProps2}
        stroke="currentColor"
      />
    </Svg>
  );
};

export default () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Animated test</Text>
      <AnimatedTest />
      <Text>Reanimated test</Text>
      <ReanimatedTest />
    </View>
  );
};

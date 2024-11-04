import React, {useEffect} from 'react';
import Animated, {
  useSharedValue,
  withTiming,
  Easing,
  withRepeat,
  interpolate,
  useDerivedValue,
  useAnimatedProps,
} from 'react-native-reanimated';
import {Svg, Circle} from 'react-native-svg';

export default () => {
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  const animatedValue = useSharedValue(0);
  const timingAnimatedValue = useDerivedValue(() =>
    withRepeat(
      withTiming(animatedValue.value, {
        duration: 1250,
        easing: Easing.out(Easing.cubic),
      }),
      -1,
    ),
  );
  const animatedProps = useAnimatedProps(() => ({
    strokeDasharray: [
      interpolate(
        timingAnimatedValue.value,
        [0, 50, 100],
        [8.1681408993, 40.8407044967, 8.1681408993],
      ),
      interpolate(
        timingAnimatedValue.value,
        [0, 50, 100],
        [73.513268094, 40.8407045967, 73.513268094],
      ),
    ],
  }));

  useEffect(() => {
    animatedValue.value = 100;
  }, []);

  return (
    <Animated.View
      style={{
        flex: 1,
        paddingTop: 200,
        justifyContent: 'center',
        alignContent: 'center',
      }}>
      <Svg>
        <AnimatedCircle
          cx="15"
          cy="15"
          r="13"
          stroke="red"
          strokeWidth="2.5"
          strokeLinecap="round"
          animatedProps={animatedProps}
          fill="none"
        />
      </Svg>
    </Animated.View>
  );
};

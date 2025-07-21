import React, {useEffect} from 'react';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {Circle, Rect, Svg} from 'react-native-svg';

// @ts-expect-error broken reanimated types
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
// @ts-expect-error broken reanimated types
const AnimatedRect = Animated.createAnimatedComponent(Rect);

export default function ReanimatedOpacity() {
  const sv = useSharedValue(0);

  useEffect(() => {
    sv.value = 0;
    sv.value = withRepeat(
      withTiming(1, {duration: 3000, easing: Easing.linear}),
      -1,
    );
  });

  const animatedProps = useAnimatedProps(() => ({
    fillOpacity: `${sv.value * 100}%`,
    strokeOpacity: `${sv.value * 100}%`,
  }));

  return (
    <Svg height="400" width="400">
      {/* @ts-ignore broken reanimated types */}
      <AnimatedRect
        x="100"
        y="100"
        width="100"
        height="100"
        fill="green"
        stroke="black"
        strokeWidth="20"
        // @ts-ignore broken reanimated types
        animatedProps={animatedProps}
      />
      {/* @ts-ignore broken reanimated types */}
      <AnimatedCircle
        cx="250"
        cy="50"
        r="40"
        fill="blue"
        stroke="black"
        strokeWidth="20"
        // @ts-ignore broken reanimated types
        animatedProps={animatedProps}
      />
    </Svg>
  );
}

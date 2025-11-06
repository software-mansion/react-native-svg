import React from 'react';
import Animated, {
  createAnimatedPropAdapter,
  interpolateColor,
  processColor,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {Circle, Svg} from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const adapter = createAnimatedPropAdapter(
  props => {
    if (Object.keys(props).includes('fill')) {
      props.fill = {type: 0, payload: processColor(props.fill)};
    }
  },
  ['fill'],
);

export default function App() {
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    opacity.value = withRepeat(withTiming(1), -1, true);
  }, []);

  const circleAnimatedProps = useAnimatedProps(
    () => {
      const coordinates = {cx: 50, cy: 50, r: 50};

      return {
        cx: coordinates.cx,
        cy: coordinates.cy,
        r: coordinates.r,
        fill: interpolateColor(opacity.value, [0, 1], ['red', 'green']),
        opacity: opacity.value,
        strokeWidth: 2,
      };
    },
    [],
    adapter,
  );

  return (
    <Svg width="100%" height="100%">
      <AnimatedCircle animatedProps={circleAnimatedProps} />
    </Svg>
  );
}

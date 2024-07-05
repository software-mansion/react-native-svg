import React, {useEffect} from 'react';
import Animated, {
  AnimatedProps,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {
  Circle,
  FeColorMatrix,
  FeColorMatrixProps,
  Filter,
  Image,
  Svg,
} from 'react-native-svg';

const AnimatedFeColorMatrix = Animated.createAnimatedComponent(
  FeColorMatrix as any,
) as React.FunctionComponent<AnimatedProps<FeColorMatrixProps>>;
const ReanimatedHueRotateExample = () => {
  const hue = useSharedValue(0);

  useEffect(() => {
    hue.value = withRepeat(withTiming(360, {duration: 2000}), -1, true);
  }, []);
  const animatedProps = useAnimatedProps(() => {
    return {values: [hue.value]};
  });

  return (
    <Svg height="100" width="150">
      <Filter id="filter">
        <AnimatedFeColorMatrix type="hueRotate" animatedProps={animatedProps} />
      </Filter>
      <Image
        href="https://cdn.pixabay.com/photo/2024/05/26/00/40/lizard-8787888_1280.jpg"
        height="100"
        width="150"
        filter="url(#filter)"
      />
    </Svg>
  );
};
ReanimatedHueRotateExample.title = 'Reanimated Hue Rotate';

const icon = (
  <Svg height="30" width="30" viewBox="0 0 20 20">
    <Circle cx="10" cy="7.5" r="5" fill="blue" fillOpacity="0.5" />
    <Circle cx="7.5" cy="12.5" r="5" fill="green" fillOpacity="0.5" />
    <Circle cx="12.5" cy="12.5" r="5" fill="red" fillOpacity="0.5" />
  </Svg>
);

const samples = [ReanimatedHueRotateExample];
export {icon, samples};

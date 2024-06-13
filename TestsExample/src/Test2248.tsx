import React, {useEffect, useRef} from 'react';
import {Path, Svg} from 'react-native-svg';
import {Animated} from 'react-native';

const AnimatedPath = Animated.createAnimatedComponent(Path as any);

type Props = {
  value: number;
  color: string;
};
const Test2248 = ({value = 86, color = '#ED745F'}: Props) => {
  const animationValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animatePath = () => {
      Animated.loop(
        Animated.timing(animationValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ).start();
    };

    animatePath();

    return () => {
      animationValue.setValue(0);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Svg width="150" height="120" viewBox="0 0 100 80">
      <Path
        d="M22.37 60.987a30.3 30.3 0 0 1-2.357-11.76C20.013 32.54 33.44 19.012 50 19.012S79.987 32.54 79.987 49.226c0 4.172-.84 8.146-2.357 11.76"
        fill="none"
        strokeWidth={14}
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#3a393e"
      />
      <AnimatedPath
        d="M22.37 60.987a30.3 30.3 0 0 1-2.357-11.76C20.013 32.54 33.44 19.012 50 19.012S79.987 32.54 79.987 49.226c0 4.172-.84 8.146-2.357 11.76"
        strokeDasharray={animationValue.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: ['0 120', `${(120 * value) / 100} 120`, '0 120'],
        })}
        fill="none"
        strokeWidth={14}
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke={color}
      />
    </Svg>
  );
};

export default Test2248;

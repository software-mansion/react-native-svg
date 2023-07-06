import React, {useEffect} from 'react';
import {Animated, Easing, View} from 'react-native';
import {Svg, Circle} from 'react-native-svg';

export default () => {
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  const animatedValue = new Animated.Value(0);
  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 100,
        duration: 1250,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  return (
    <View
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
          strokeDasharray={animatedValue.interpolate({
            inputRange: [0, 50, 100],
            outputRange: [
              '8.1681408993,73.513268094',
              '40.8407044967,40.8407045967',
              '8.1681408993,73.513268094',
            ],
          })}
          fill="none"
        />
      </Svg>
    </View>
  );
};

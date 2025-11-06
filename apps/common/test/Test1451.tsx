import React, {useEffect, useRef} from 'react';
import {Animated, View} from 'react-native';
import {Circle, Mask, Path, Rect, Svg} from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle as any);

export default () => {
  const zoom = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(zoom, {
          toValue: 4,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(zoom, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  });

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View style={{borderWidth: 3}}>
        <Svg width="400" height="400" viewBox="0 0 400 400">
          <Mask id="myMask">
            <Rect x="0" y="0" width="100" height="100" fill="white" />
            <Path
              d="M10,35 A20,20,0,0,1,50,35 A20,20,0,0,1,90,35 Q90,65,50,95 Q10,65,10,35 Z"
              fill="black"
            />
          </Mask>
          <Rect x="0" y="0" width="150" height="150" fill="pink" />
          <AnimatedCircle
            cx="50"
            cy="50"
            r="50"
            fill="purple"
            mask="url(#myMask)"
            matrix={[zoom, 0, 0, zoom, 0, 0]}
          />
        </Svg>
      </View>
    </View>
  );
};

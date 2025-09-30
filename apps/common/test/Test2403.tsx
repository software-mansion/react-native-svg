import {useCallback} from 'react';
import {
  Animated,
  Button,
  Easing,
  Text,
  View,
  useAnimatedValue,
} from 'react-native';
import {Circle, Mask, Path, Rect, Svg} from 'react-native-svg';

export const EASING_IN: (t: number) => number = Easing.bezier(0.7, 0, 0.3, 1);
export const EASING_OUT: (t: number) => number = Easing.bezier(0.5, 0, 0.5, 1);

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

export default function Playground() {
  const animatedValue = useAnimatedValue(0);

  const handleMouseEnter = useCallback(() => {
    Animated.timing(animatedValue, {
      duration: 350,
      easing: EASING_IN,
      toValue: 1,
      useNativeDriver: false,
    }).start();
  }, [animatedValue]);

  const handleMouseLeave = useCallback(() => {
    Animated.timing(animatedValue, {
      duration: 350,
      easing: EASING_OUT,
      toValue: 0,
      useNativeDriver: false,
    }).start();
  }, [animatedValue]);

  return (
    <View
      style={{
        paddingTop: 100,
        marginHorizontal: 16,
        flex: 1,
      }}>
      <Text style={{zIndex: 100}}>Text1</Text>
      <AnimatedSvg
        height="200"
        viewBox="0 0 200 200"
        width="200"
        // use transform or style.transform
        // transform={[
        //   {
        //     scale: animatedValue.interpolate({
        //       inputRange: [0, 1],
        //       outputRange: [1, 1.2],
        //     }),
        //   },
        // ]}
        style={{
          transform: [
            {
              scale: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.2],
              }),
            },
          ],
        }}
        //
      >
        <Mask id="myMask">
          <Rect fill="white" height="100" width="100" x="0" y="0" />
          <Path
            d="M10,35 A20,20,0,0,1,50,35 A20,20,0,0,1,90,35 Q90,65,50,95 Q10,65,10,35 Z"
            fill="black"
          />
        </Mask>
        <Rect fill="pink" height="200" width="300" x="0" y="0" />
        <Circle
          cx="50"
          cy="50"
          fill="purple"
          mask="url(#myMask)"
          r="50"
          onPress={() => console.log('sadas')}
        />
        <Rect fill="green" x="50" y="100" width="100" height="100" />
      </AnimatedSvg>

      <Text>Text2</Text>
      <Button onPress={handleMouseEnter} title="Mouse Enter" />
      <Button onPress={handleMouseLeave} title="Mouse Leave" />
    </View>
  );
}

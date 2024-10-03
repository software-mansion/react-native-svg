import {useEffect, useRef} from 'react';
import {View, Animated} from 'react-native';
import {Svg, Path, Rect, Defs, ClipPath} from 'react-native-svg';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

function LiquidTank() {
  const liquidValue = 50;

  const factor = 1.54; // 154 / 100
  const height = factor * -liquidValue;

  const heightAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    heightAnim.setValue(0);
    const fillAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(heightAnim, {
          toValue: height,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(heightAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    );
    fillAnimation.start();
  }, [height]);

  return (
    <View>
      <Svg width={250} height={100} viewBox="0 0 375 154">
        <Defs>
          <ClipPath id={`clip-${height}`}>
            <AnimatedRect x={0} y={154} width={400} height={heightAnim} />
          </ClipPath>
        </Defs>

        <Path
          fill="blue"
          clipPath={`url(#clip-${height})`}
          d="M375 77c0-26.515-13.353-50.48-33.922-67.641C335.034 4.316 327.339 2 318.606 2v150c8.733 0 17.362-2.311 23.376-7.377C362.353 127.462 375 103.506 375 77zm-56.394 75V2H56.394v150h262.212zM33.018 9.377C12.647 26.537 0 50.494 0 77c0 26.505 12.647 50.462 33.018 67.623C39.032 149.689 47.66 152 56.394 152V2C47.66 2 39.032 4.311 33.018 9.377z"
        />
        <Path
          fill="blue"
          clipPath={`url(#clip-${height})`}
          d="M86.333 0h17.334C104.955 0 105 .43 105 2.04v2.04H85V2.04C85 .43 85.045 0 86.333 0zM85 149.921v2.039c0 1.61.045 2.04 1.333 2.04h17.334c1.288 0 1.333-.43 1.333-2.04v-2.039H85z"
        />
        <Path
          fill="blue"
          clipPath={`url(#clip-${height})`}
          d="M85 4.08v145.84h20V4.079H85zM271.333 0h17.334C289.955 0 290 .43 290 2.04v2.04h-20V2.04c0-1.61.045-2.04 1.333-2.04zM270 149.921v2.039c0 1.61.045 2.04 1.333 2.04h17.334c1.288 0 1.333-.43 1.333-2.04v-2.039h-20z"
        />
        <Path
          fill="blue"
          clipPath={`url(#clip-${height})`}
          d="M270 4.08v145.84h20V4.079h-20z"
        />

        {/* It works if I move the AnimatedRect here */}
        {/* <AnimatedRect fill="#00AFEA" x={0} y={154} width={400} height={heightAnim} /> */}
      </Svg>
    </View>
  );
}

export default LiquidTank;

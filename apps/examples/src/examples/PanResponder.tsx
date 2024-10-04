import React, {useRef} from 'react';
import {
  Animated,
  PanResponder,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {G, Line, Path, Polyline, Svg, Text} from 'react-native-svg';
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const zeroDelta = {x: 0, y: 0};

const PanExample = () => {
  const xy = useRef(new Animated.ValueXY()).current;
  let offset = zeroDelta;

  xy.addListener(flatOffset => {
    offset = flatOffset;
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: () => {
        xy.setOffset(offset);
        xy.setValue(zeroDelta);
      },
      onPanResponderMove: Animated.event([null, {dx: xy.x, dy: xy.y}], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        xy.flattenOffset();
      },
    }),
  ).current;

  const panStyle = {
    transform: xy.getTranslateTransform(),
  };

  return (
    <TouchableWithoutFeedback>
      <View>
        <AnimatedSvg
          height="200"
          width="200"
          style={panStyle}
          {...panResponder.panHandlers}>
          <Path
            d="M50,5L20,99L95,39L5,39L80,99z"
            stroke="black"
            fill="red"
            strokeWidth="6"
            scale="0.8"
          />
          <Text
            fontSize="20"
            fontWeight="bold"
            fill="blue"
            textAnchor="middle"
            x="40"
            y="80">
            STAR
          </Text>
        </AnimatedSvg>
      </View>
    </TouchableWithoutFeedback>
  );
};

PanExample.title = 'Bind PanResponder on the SVG Shape';

const icon = (
  <Svg height="30" width="30" viewBox="0 0 20 20">
    <G strokeWidth="1" stroke="#ccc" fill="#ccc">
      <Line x1="4" y1="5" x2="16" y2="5" />
      <Polyline points="6,2 4,5 6,8" />
      <Line x1="10" y1="1" x2="10" y2="5" />
      <Polyline points="14,2 16,5 14,8" />
      <Polyline points="7,3 10,1 13,3" />
    </G>
    <Path
      fill="#fff"
      stroke="#000"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const title = 'Bind PanResponder on the SVG Shape';
const shouldBeRenderInView = true;
const samples = [PanExample];

const scroll = false;

export {icon, samples, scroll, title, shouldBeRenderInView};

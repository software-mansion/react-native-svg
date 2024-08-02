import React, {PureComponent} from 'react';
import {
  Animated,
  PanResponder,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {G, Line, Path, Polyline, Svg, Text} from 'react-native-svg';

const AnimatedSvg = Animated.createAnimatedComponent(Svg as any);

const zeroDelta = {x: 0, y: 0};

class PanExample extends PureComponent {
  static title = 'Bind PanResponder on the SVG Shape';
  panXY: any;
  constructor(props: {}, context: {}) {
    super(props, context);
    const xy = new Animated.ValueXY();
    const {x: dx, y: dy} = xy;
    let offset = zeroDelta;
    xy.addListener(flatOffset => {
      offset = flatOffset;
    });
    const {panHandlers} = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: () => {
        xy.setOffset(offset);
        xy.setValue(zeroDelta);
      },
      onPanResponderMove: Animated.event([null, {dx, dy}], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        xy.flattenOffset();
      },
    });
    this.panXY = {
      style: {
        transform: xy.getTranslateTransform(),
      },
      ...panHandlers,
    };
  }
  render() {
    return (
      <TouchableWithoutFeedback>
        <View>
          <AnimatedSvg height="200" width="200" {...this.panXY}>
            <Path
              d="M50,5L20,99L95,39L5,39L80,99z"
              stroke={'black'}
              fill={'red'}
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
  }
}

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
      d={`M6.2,9.4
          c0,0,0-0.1,0-0.2c0-0.2,0.1-0.3,0.1-0.4c0.2-0.4,0.5-0.7,1-0.7c0.3,0,0.5,0,0.6,0h0.1v0.7V10 M8.1,8.8c0,0,0-0.1,0-0.2
	c0-0.2,0.1-0.3,0.1-0.4c0.2-0.4,0.5-0.7,1-0.7c0.3,0,0.5,0,0.6,0h0.1v1.9 M10.1,7.5v-2c0,0,0-0.1,0-0.2c0-0.2,0.1-0.3,0.1-0.4
	c0.2-0.4,0.5-0.6,0.9-0.7c0.4,0,0.7,0.2,0.9,0.7C12,5,12,5.2,12,5.4c0,0.1,0,0.1,0,0.2v6c1.4-1.8,2.4-1.8,2.8,0.1
	c-1.7,1.5-2.9,3.7-3.4,6.4l-5.8,0c-0.2-0.6-0.5-1.4-0.7-2.5c-0.3-1-0.5-2.5-0.6-4.5l0-0.8c0-0.1,0-0.1,0-0.2c0-0.2,0.1-0.3,0.1-0.4
	c0.2-0.4,0.5-0.7,1-0.7c0.3,0,0.5,0,0.6,0l0.1,0v0.5c0,0,0,0,0,0l0,1.1l0,0.2 M6.2,10.9l0-0.4`}
    />
  </Svg>
);

const samples = [PanExample];

const scroll = false;

export {icon, samples, scroll};

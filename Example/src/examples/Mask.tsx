import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  Svg,
  Circle,
  Path,
  Rect,
  Mask,
  Polygon,
  Defs,
  LinearGradient,
  Stop,
  Text,
} from 'react-native-svg';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 100,
    width: 200,
  },
  svg: {
    flex: 1,
    alignSelf: 'stretch',
  },
});

class SimpleMask extends Component {
  static title = 'Simple svg with mask';
  render() {
    return (
      <View style={styles.container}>
        <Svg viewBox="-10 -10 120 120">
          <Rect x={-10} y={-10} width={120} height={120} fill="blue" />
          <Mask id="myMask">
            <Rect x={0} y={0} width={100} height={100} fill="white" />
            <Path
              d="M10,35 A20,20,0,0,1,50,35 A20,20,0,0,1,90,35 Q90,65,50,95 Q10,65,10,35 Z"
              fill="black"
            />
          </Mask>
          <Polygon points="-10,110 110,110 110,-10" fill="orange" />
          <Circle cx={50} cy={50} r={50} fill="purple" mask="url(#myMask)" />
        </Svg>
      </View>
    );
  }
}

class AnotherMask extends Component {
  static title = 'Another svg with mask';
  render() {
    return (
      <View style={styles.container}>
        <Svg width={500} height={120}>
          <Defs>
            <Mask id="mask1" x={0} y={0} width={100} height={100}>
              <Rect
                x={0}
                y={0}
                width={100}
                height={50}
                stroke="none"
                fill="#ffffff"
              />
            </Mask>
          </Defs>
          <Rect
            x={1}
            y={1}
            width={100}
            height={100}
            stroke="none"
            fill="#0000ff"
            mask="url(#mask1)"
          />
          <Rect
            x={1}
            y={1}
            width={100}
            height={100}
            stroke="#000000"
            fill="none"
          />
        </Svg>
      </View>
    );
  }
}

class MaskWithText extends Component {
  static title = 'Svg with with text and a mask with gradient';
  render() {
    return (
      <View style={styles.container}>
        <Svg width={500} height={120}>
          <Defs>
            <LinearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#ffffff" stopOpacity={1} />
              <Stop offset="100%" stopColor="#000000" stopOpacity={1} />
            </LinearGradient>
            <Mask id="mask4" x={0} y={0} width={200} height={100}>
              <Rect
                x={0}
                y={0}
                width={200}
                height={100}
                stroke="none"
                fill="url(#gradient1)"
              />
            </Mask>
          </Defs>
          <Text x={10} y={55} stroke="none" fill="#000000">
            {'This text is under the rectangle'}
          </Text>
          <Rect
            x={1}
            y={1}
            width={200}
            height={100}
            stroke="none"
            fill="#0000ff"
            mask="url(#mask4)"
          />
        </Svg>
      </View>
    );
  }
}

const icon = (
  <Svg width="30" height="30" viewBox="-10 -10 120 120">
    <Rect x={-10} y={-10} width={120} height={120} fill="blue" />
    <Mask id="myMask">
      <Rect x={0} y={0} width={100} height={100} fill="white" />
      <Path
        d="M10,35 A20,20,0,0,1,50,35 A20,20,0,0,1,90,35 Q90,65,50,95 Q10,65,10,35 Z"
        fill="black"
      />
    </Mask>
    <Polygon points="-10,110 110,110 110,-10" fill="orange" />
    <Circle cx={50} cy={50} r={50} fill="purple" mask="url(#myMask)" />
  </Svg>
);

const samples = [SimpleMask, AnotherMask, MaskWithText];

export {icon, samples};

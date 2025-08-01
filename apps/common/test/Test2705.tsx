import {Text, View, StyleSheet, SafeAreaView} from 'react-native';
import {
  Gesture,
  GestureHandlerRootView,
  GestureDetector,
} from 'react-native-gesture-handler';

import Svg, {Circle, Rect} from 'react-native-svg';

export default function SvgExample() {
  const circleElementTap = Gesture.Tap().onStart(() =>
    console.log('RNGH: clicked circle'),
  );
  const rectElementTap = Gesture.Tap().onStart(() =>
    console.log('RNGH: clicked parallelogram'),
  );
  const containerTap = Gesture.Tap().onStart(() =>
    console.log('RNGH: clicked container'),
  );
  const vbContainerTap = Gesture.Tap().onStart(() =>
    console.log('RNGH: clicked viewbox container'),
  );
  const vbInnerContainerTap = Gesture.Tap().onStart(() =>
    console.log('RNGH: clicked inner viewbox container'),
  );
  const vbCircleTap = Gesture.Tap().onStart(() =>
    console.log('RNGH: clicked viewbox circle'),
  );

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>
          Overlapping SVGs with gesture detectors
        </Text>
        <View style={{backgroundColor: 'tomato'}}>
          <GestureDetector gesture={containerTap}>
            <Svg
              height="250"
              width="250"
              onPress={() => console.log('SVG: clicked container')}>
              <GestureDetector gesture={circleElementTap}>
                <Circle
                  cx="125"
                  cy="125"
                  r="125"
                  fill="green"
                  onPress={() => console.log('SVG: clicked circle')}
                />
              </GestureDetector>
              <GestureDetector gesture={rectElementTap}>
                <Rect
                  skewX="45"
                  width="125"
                  height="250"
                  fill="yellow"
                  onPress={() => console.log('SVG: clicked parallelogram')}
                />
              </GestureDetector>
            </Svg>
          </GestureDetector>
        </View>
        <Text>
          Tapping each color should read to a different console.log output
        </Text>
      </SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.header}>SvgView with SvgView with ViewBox</Text>
        <View style={{backgroundColor: 'tomato'}}>
          <GestureDetector gesture={vbContainerTap}>
            <Svg
              height="250"
              width="250"
              viewBox="-50 -50 150 150"
              onPress={() => console.log('SVG: clicked viewbox container')}>
              <GestureDetector gesture={vbInnerContainerTap}>
                <Svg
                  height="250"
                  width="250"
                  viewBox="-300 -300 600 600"
                  onPress={() =>
                    console.log('SVG: clicked inner viewbox container')
                  }>
                  <Rect
                    x="-300"
                    y="-300"
                    width="600"
                    height="600"
                    fill="yellow"
                  />
                  <GestureDetector gesture={vbCircleTap}>
                    <Circle
                      r="300"
                      fill="green"
                      onPress={() => console.log('SVG: clicked viewbox circle')}
                    />
                  </GestureDetector>
                </Svg>
              </GestureDetector>
            </Svg>
          </GestureDetector>
        </View>
        <Text>The viewBox property remaps SVG's coordinate space</Text>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 48,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 10,
  },
});

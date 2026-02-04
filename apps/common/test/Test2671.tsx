import {useState} from 'react';
import {View, Button, Text, Dimensions, StyleSheet} from 'react-native';
import Svg, {Line, Rect} from 'react-native-svg';

const initialWidth = 150;

const deviceHeight = Dimensions.get('window').height;

export default function Test2671() {
  const [width, setWidth] = useState(initialWidth);

  const lineContainerStyles = {
    width,
    paddingTop: 40,
  };
  return (
    <View style={styles.container}>
      <Button
        title={'Change width to ' + width}
        onPress={() =>
          setWidth(prev =>
            prev === initialWidth ? initialWidth * 2 : initialWidth,
          )
        }
      />
      {/* NOT WORKING EXAMPLE */}
      <View style={lineContainerStyles}>
        <Text>Not working</Text>
        <Svg height={4} width="100%" style={styles.dashedLineContainer}>
          <Line
            x2="100%"
            x1="0"
            stroke="red"
            strokeWidth={4}
            strokeDasharray="5, 2"
          />
        </Svg>
      </View>
      {/* NOT WORKING EXAMPLE */}
      <View style={lineContainerStyles}>
        <Text>Not working</Text>
        <Svg height={50} width="100%">
          <Rect
            x="0"
            y="0"
            width="100%"
            height={50}
            stroke="red"
            strokeWidth="1"
            fill="yellow"
          />
        </Svg>
      </View>
      {/*
       * WORKING EXAMPLE
       * Difference
       * - Svg -> overflow: "hidden"
       * - Line -> x2={deviceHeight} (before there was 100%)
       */}
      <View style={lineContainerStyles}>
        <Text>Working</Text>
        <Svg
          height={4}
          width="100%"
          style={[
            {
              overflow: 'hidden',
            },
            styles.dashedLineContainer,
          ]}>
          <Line
            x2={deviceHeight}
            x1="0"
            stroke="red"
            strokeWidth={4}
            strokeDasharray="5, 2"
          />
        </Svg>
      </View>
      {/* WORKING EXAMPLE - ?? */}
      <View style={lineContainerStyles}>
        <Text>Not working</Text>
        <Svg height={50} width="100%">
          <Rect
            x="0"
            y="0"
            width={deviceHeight}
            height={50}
            stroke="red"
            strokeWidth="1"
            fill="yellow"
          />
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 300,
  },
  dashedLineContainer: {
    bottom: -2,
    height: 4,
    position: 'absolute',
  },
});

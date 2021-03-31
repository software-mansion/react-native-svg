'use strict';
import React from 'react';
import {Example} from '../components/Example';
import {Page} from '../components/Page';
import {StyleSheet, View} from 'react-native';
import {Svg, Rect, Circle, Path, Line} from 'react-native-svg-desktop';

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

export const SvgPage: React.FunctionComponent<{}> = () => {
  return (
    <Page title="Svg">
      <Example title="Svg">
        <Svg height="100" width="100">
          <Circle
            cx="50"
            cy="50"
            r="45"
            stroke="blue"
            strokeWidth="2.5"
            fill="green"
          />
          <Rect
            x="15"
            y="15"
            width="70"
            height="70"
            stroke="red"
            strokeWidth="2"
            fill="yellow"
          />
        </Svg>
      </Example>
      <Example title="SVG with 'opacity' prop">
        <Svg height="100" width="100" opacity="0.2">
          <Circle
            cx="50"
            cy="50"
            r="45"
            stroke="blue"
            strokeWidth="2.5"
            fill="green"
          />
          <Rect
            x="15"
            y="15"
            width="70"
            height="70"
            stroke="red"
            strokeWidth="2"
            fill="yellow"
          />
        </Svg>
      </Example>
      <Example title="SVG with `viewBox='40 20 100 40' and preserveAspectRatio='none'`">
        <Svg
          height="100"
          width="100"
          viewBox="40 20 100 40"
          preserveAspectRatio="none">
          <Rect x="0" y="0" width="100" height="100" fill="red" />
          <Circle cx="50" cy="50" r="30" fill="yellow" />
          <Circle cx="40" cy="40" r="4" fill="black" />
          <Circle cx="60" cy="40" r="4" fill="black" />
          <Path d="M 40 60 A 10 10 0 0 0 60 60" stroke="black" fill="black"/>
        </Svg>
      </Example>
      <Example title="SVG with flex layout">
        <View style={styles.container}>
          <Svg style={styles.svg}>
            <Rect
              width="80%"
              height="80%"
              x="10%"
              y="10%"
              fill="purple"
              stroke="yellow"
              strokeWidth="4"
            />
            <Line
              x1="10%"
              y1="10%"
              x2="90%"
              y2="90%"
              stroke="yellow"
              strokeWidth="4"
            />
            <Line
              x1="10%"
              y1="90%"
              x2="90%"
              y2="10%"
              stroke="yellow"
              strokeWidth="4"
            />
          </Svg>
        </View>
      </Example>
    </Page>
  );
};

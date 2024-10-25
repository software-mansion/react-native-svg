import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import Svg, {Rect} from 'react-native-svg';

export default () => {
  return (
    <SafeAreaView style={styles.container}>
      <Svg
        width={200}
        height={200}
        viewBox="0 0 200 200"
        hitSlop={50}
        // hitSlop={{top: 50, left: 50, right: 50, bottom: 50}}
        onPress={() => console.log('press')}>
        <Rect
          width={200}
          height={200}
          x={0}
          y={0}
          fill="red"
          onPress={() => console.log('rect press')}
        />
      </Svg>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

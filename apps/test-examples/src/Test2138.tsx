import * as React from 'react';

import {Alert, StyleSheet, Text, View} from 'react-native';
import Svg, {Path, Rect} from 'react-native-svg';

export default function App() {
  return (
    <View style={styles.outer}>
      <View style={styles.inner}>
        <Shape height={100} /*width={100}*/ />
        {/* Uncomment to make it work on native */}
        <Shape height={100} /*width={100}*/ />
      </View>
    </View>
  );
}

function Shape(props: any) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="black"
      {...props}>
      <Path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10S2 17.514 2 12 6.486 2 12 2zm0-2C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.507 13.941c-1.512 1.195-3.174 1.931-5.506 1.931-2.334 0-3.996-.736-5.508-1.931L6 14.434C7.127 16.154 9.2 18 12.001 18c2.8 0 4.872-1.846 5.999-3.566l-.493-.493zM8.5 8a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm7 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  inner: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    height: 100,
    flex: 1,
    backgroundColor: 'green',
  },

  outer: {
    marginTop: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    height: 150,
    width: '100%',
  },
});

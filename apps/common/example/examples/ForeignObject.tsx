import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ForeignObject, Svg} from 'react-native-svg';

function ForeignObjectExample() {
  return (
    <Svg height="300" width="300">
      <ForeignObject width={300} height={300}>
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <Text style={styles.text}>Centered Text</Text>
          </View>
        </View>
      </ForeignObject>
    </Svg>
  );
}
ForeignObjectExample.title = 'ForeignObject with centered Text';

function ForeignObjectWithView() {
  return (
    <Svg height="300" width="300" style={{backgroundColor: 'lightgray'}}>
      <ForeignObject width={300} height={300}>
        <View style={styles.fullSizeView} />
      </ForeignObject>
    </Svg>
  );
}
ForeignObjectWithView.title = 'ForeignObject with full size View';

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: 300,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    width: 150,
    height: 150,
    backgroundColor: 'yellow',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
  },
  iconContainer: {
    width: 15,
    height: 15,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconInnerContainer: {
    width: 7.5,
    height: 7.5,
    backgroundColor: 'yellow',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullSizeView: {
    width: '100%',
    height: '100%',
    backgroundColor: 'blue',
  },
});

const icon = (
  <Svg height="30" width="30" viewBox="0 0 20 20">
    <ForeignObject x={2.5} y={2.5}>
      <View style={styles.iconContainer}>
        <View style={styles.iconInnerContainer} />
      </View>
    </ForeignObject>
  </Svg>
);
const samples = [ForeignObjectExample, ForeignObjectWithView];

export {icon, samples};

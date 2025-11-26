import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ForeignObject, Svg} from 'react-native-svg';

function ForeignObjectExample() {
  return (
    <Svg height="300" width="300">
      <ForeignObject width={300} height={300}>
        <View
          style={{
            width: 300,
            height: 300,
            backgroundColor: 'red',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: 150,
              height: 150,
              backgroundColor: 'yellow',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                textAlign: 'center',
              }}>
              Centered Text
            </Text>
          </View>
        </View>
      </ForeignObject>
    </Svg>
  );
}
ForeignObjectExample.title = 'ForeignObject with centered Text';

function ForeignObjectWithView() {
  return (
    <Svg
      height="300"
      width="300"
      style={{backgroundColor: 'lightgray'}}
      viewBox="0 0 400 400">
      <ForeignObject x={50} y={50} width={300} height={300}>
        <View style={{width: '100%', height: '100%', backgroundColor: 'blue'}}>
          <View
            style={{
              width: '50%',
              height: '50%',
              backgroundColor: 'red',
            }}
          />
        </View>
      </ForeignObject>
      <ForeignObject x={150} y={150} width={100} height={100}>
        <View
          style={{width: '100%', height: '100%', backgroundColor: 'red'}}
          collapsable={false}>
          <View
            style={{
              width: '50%',
              height: '50%',
              backgroundColor: 'blue',
            }}
          />
        </View>
      </ForeignObject>
    </Svg>
  );
}
ForeignObjectWithView.title = 'ForeignObject with full size View';

function ForeignObjectWithBigView() {
  return (
    <Svg
      height="300"
      width="300"
      style={{backgroundColor: 'lightgray'}}
      viewBox="0 0 600 600">
      <ForeignObject width={600} height={600}>
        <View style={{width: 600, height: 600, backgroundColor: 'blue'}}>
          <View
            style={{
              width: 300,
              height: 300,
              backgroundColor: 'red',
            }}
          />
        </View>
      </ForeignObject>
    </Svg>
  );
}
ForeignObjectWithBigView.title = 'ForeignObject with big View';

function ForeignObjectWithFlexView() {
  return (
    <Svg
      height="300"
      width="300"
      style={{backgroundColor: 'lightgray'}}
      viewBox="0 0 600 600">
      <ForeignObject width={600} height={600}>
        <View
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'blue',
            flexDirection: 'row',
          }}>
          <View style={{flex: 1 / 2, backgroundColor: 'red'}} />
        </View>
      </ForeignObject>
    </Svg>
  );
}
ForeignObjectWithFlexView.title = 'ForeignObject with flex View';

const styles = StyleSheet.create({
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
const samples = [
  ForeignObjectExample,
  ForeignObjectWithView,
  ForeignObjectWithBigView,
  ForeignObjectWithFlexView,
];

export {icon, samples};

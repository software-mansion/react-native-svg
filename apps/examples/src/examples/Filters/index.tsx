import React from 'react';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {Circle, Svg} from 'react-native-svg';

import * as examples from './examples';
import {commonStyles} from '../../commonStyles';

const FiltersList = () => {
  const [example, setExample] = React.useState<keyof typeof examples | null>(
    null,
  );

  if (example) {
    return (
      <>
        {examples[example].samples.map((Sample, i) => (
          <View style={commonStyles.example} key={`sample-${i}`}>
            <Text style={commonStyles.sampleTitle}>{Sample.title}</Text>
            <Sample />
          </View>
        ))}
      </>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={commonStyles.welcome}>SVG Filters</Text>
      {Object.keys(examples).map((element, i) => {
        const name = element as keyof typeof examples;
        return (
          <TouchableHighlight
            style={styles.link}
            underlayColor="#ccc"
            key={`example-${name}`}
            onPress={() => setExample(name)}>
            <View style={commonStyles.cell}>
              {examples[name].icon}
              <Text style={commonStyles.title}>{name}</Text>
            </View>
          </TouchableHighlight>
        );
      })}
    </View>
  );
};
FiltersList.title = '';

const styles = StyleSheet.create({
  container: {width: '100%'},
  link: {height: 40},
});

const icon = (
  <Svg height="30" width="30" viewBox="0 0 20 20">
    <Circle cx="10" cy="7.5" r="5" fill="blue" fillOpacity="0.5" />
    <Circle cx="7.5" cy="12.5" r="5" fill="green" fillOpacity="0.5" />
    <Circle cx="12.5" cy="12.5" r="5" fill="red" fillOpacity="0.5" />
  </Svg>
);

const samples = [FiltersList];

export {icon, samples};

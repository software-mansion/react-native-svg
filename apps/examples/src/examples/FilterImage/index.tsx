import React from 'react';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';

import {FilterImage} from 'react-native-svg/filter-image';
import {commonStyles} from '../../commonStyles';
import * as examples from './examples';

const FilterImageList = () => {
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
      <Text style={commonStyles.welcome}>Filter Image</Text>
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
FilterImageList.title = '';

const styles = StyleSheet.create({
  container: {width: '100%'},
  link: {height: 40},
});

const icon = (
  <FilterImage
    filters={[{name: 'colorMatrix', type: 'saturate', values: [0.5]}]}
    source={require('../../assets/image.jpg')}
    width={30}
    height={30}
  />
);

const samples = [FilterImageList];

export {icon, samples};

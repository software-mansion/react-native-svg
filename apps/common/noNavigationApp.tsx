/**
 * Sample React Native App for react-native-svg library
 * https://github.com/software-mansion/react-native-svg/tree/main/apps/common/example
 */

/**
 * This is a very simple render of the examples for react-native-svg library, to avoid dependencies on @react-navigation,
 * which may not be fully supported on all platforms and versions of react-native
 */
'use strict';

import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {examples} from './example/examples';
import type {Example} from './example/utils/types';
import {commonStyles} from './example/utils/commonStyles';

const ExampleBlock = ({example, index}: {example: Example; index: number}) => {
  if (Array.isArray(example.samples)) {
    return (
      <View
        key={index}
        style={{borderWidth: 1, margin: 15, padding: 15, borderRadius: 5}}>
        {example.icon}
        <View style={[commonStyles.separator, {margin: 10}]} />
        {example.samples.map((sample, index) => {
          return (
            <View key={index} style={{margin: 15}}>
              <Text style={commonStyles.title}>{sample.title}</Text>
              {sample({})}
            </View>
          );
        })}
      </View>
    );
  }

  throw new Error('Unhandled Example type');
};

export default function App() {
  return (
    <ScrollView>
      {Object.values(examples).map((example, index) => {
        return <ExampleBlock example={example} index={index} key={index} />;
      })}
    </ScrollView>
  );
}

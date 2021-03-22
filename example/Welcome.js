'use strict';
import {StyleSheet, View, Text} from 'react-native';
import React from 'react';

const styles = StyleSheet.create({
  container: {height: '100%', justifyContent: 'center', alignItems: 'center'},
  title: {fontSize: 24},
});

export const Welcome: React.FunctionComponent<{}> = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Text />
      <Text>
        To view an example page, click the Menu button and choose from the list
        in the drawer.
      </Text>
    </View>
  );
};

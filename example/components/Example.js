import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const styles = StyleSheet.create({
  title: {
    marginTop: 30,
    marginBottom: 10,
    fontSize: 20,
  },
  box: {
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#555',
  },
  exampleContainer: {
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  codeContainer: {
    borderWidth: 0,
    borderTopWidth: 1,
    borderColor: '#555',
  },
});

export function Example(props: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View>
      <Text style={styles.title}>{props.title}</Text>
        <View style={styles.box}>
          <View style={styles.exampleContainer}>{props.children}</View>
        </View>
    </View>
  );
}

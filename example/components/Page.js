import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignSelf: 'stretch',
    height: '100%',
  },
  title: {
    fontWeight: '200',
    fontSize: 26,
  },
  titlePane: {
    marginTop: 20,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 20,
  },
  scrollView: {
    paddingRight: 20,
  },
});

export function Page(props: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.container}>
      <View style={styles.titlePane}>
        <Text style={styles.title}>{props.title}</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {props.children}
      </ScrollView>
    </View>
  );
}

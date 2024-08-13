/**
 * Sample React Native App for react-native-svg library
 * https://github.com/magicismight/react-native-svg/tree/master/Example
 */
'use strict';

import React, {Component} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {Modal, Platform} from 'react-native';
import {Svg, Circle, Line} from 'react-native-svg';

import * as examples from './src/examples';
import {commonStyles} from './src/commonStyles';
import {E2E} from './src/examples';

const names: (keyof typeof examples)[] = [
  'Svg',
  'Stroking',
  'Path',
  'Line',
  'Rect',
  'Polygon',
  'Polyline',
  'Circle',
  'Ellipse',
  'G',
  'Text',
  'Gradients',
  'Clipping',
  'Image',
  'TouchEvents',
  'PanResponder',
  'Reusable',
  'Reanimated',
  'Transforms',
  'Markers',
  'Mask',
  'E2E',
  'Filters',
  'FilterImage',
];

const initialState = {
  modal: false,
  content: null,
};

export default class SvgExample extends Component {
  state: {
    content: React.ReactNode;
    modal: boolean;
    scroll?: boolean;
  } = initialState;

  show = (name: keyof typeof examples) => {
    if (this.state.modal) {
      return;
    }
    let example = examples[name];
    if (example) {
      let samples = example.samples;
      this.setState({
        modal: true,
        content: (
          <View>
            {samples.map((Sample, i) => (
              <View style={commonStyles.example} key={`sample-${i}`}>
                <Text style={commonStyles.sampleTitle}>{Sample.title}</Text>
                <Sample />
              </View>
            ))}
          </View>
        ),
        scroll: (example as {scroll?: boolean}).scroll !== false,
      });
    }
  };

  hide = () => {
    this.setState(initialState);
  };

  getExamples = () => {
    return names.map(name => {
      var icon;
      let example = examples[name];
      if (example) {
        icon = example.icon;
      }
      return (
        <TouchableHighlight
          style={styles.link}
          underlayColor="#ccc"
          key={`example-${name}`}
          onPress={() => this.show(name)}>
          <View style={commonStyles.cell}>
            {icon}
            <Text style={commonStyles.title}>{name}</Text>
          </View>
        </TouchableHighlight>
      );
    });
  };

  modalContent = () => (
    <>
      <SafeAreaView style={{flex: 1}}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          scrollEnabled={this.state.scroll}>
          {this.state.content}
        </ScrollView>
      </SafeAreaView>
      <SafeAreaView style={styles.close}>
        <TouchableOpacity activeOpacity={0.7} onPress={this.hide}>
          <Svg height="20" width="20">
            <Circle cx="10" cy="10" r="10" fill="red" />
            <Line x1="4" y1="4" x2="16" y2="16" stroke="#fff" strokeWidth="2" />
            <Line x1="4" y1="16" x2="16" y2="4" stroke="#fff" strokeWidth="2" />
          </Svg>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );

  render() {
    if (process.env.E2E) {
      console.log(
        'Opening E2E example, as E2E env is set to ' + process.env.E2E,
      );
      const e2eTab = React.createElement(E2E.samples[0]);
      return <SafeAreaView>{e2eTab}</SafeAreaView>;
    }
    return (
      <SafeAreaView style={styles.container}>
        <Text style={commonStyles.welcome}>SVG library for React Apps</Text>
        <View style={styles.contentContainer}>{this.getExamples()}</View>
        {(Platform.OS === 'windows' || Platform.OS === 'macos') &&
        this.state.modal ? (
          <View style={styles.scroll}>{this.modalContent()}</View>
        ) : (
          <Modal
            transparent={false}
            animationType="fade"
            visible={this.state.modal}
            onRequestClose={this.hide}>
            {this.modalContent()}
          </Modal>
        )}
      </SafeAreaView>
    );
  }
}

const hairline = StyleSheet.hairlineWidth;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    alignItems: 'center',
    overflow: 'hidden',
  },
  contentContainer: {
    alignSelf: 'stretch',
    borderTopWidth: hairline,
    borderTopColor: '#ccc',
    borderBottomWidth: hairline,
    borderBottomColor: '#ccc',
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginHorizontal: 10,
  },
  link: {
    height: 40,
    alignSelf: 'stretch',
    width: Dimensions.get('window').width / 2 - 10,
  },
  close: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
  scroll: {
    position: 'absolute',
    top: 30,
    right: 10,
    bottom: 20,
    left: 10,
    backgroundColor: '#fff',
  },
  scrollContent: {
    borderTopWidth: hairline,
    borderTopColor: '#ccc',
  },
});

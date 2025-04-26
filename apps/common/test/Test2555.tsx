import React, {Component} from 'react';
import {View, Button, Text} from 'react-native';
import {Svg, Path} from 'react-native-svg';

class PathChangingFillFromValueToUndefined extends Component<
  {},
  {fill?: 'red'}
> {
  static title =
    'Path which on a button click sets or resets fill to undefined';
  constructor(props: {}) {
    super(props);
    this.state = {
      fill: undefined,
    };
  }
  changeFill() {
    this.setState({
      fill: this.state.fill ? undefined : 'red',
    });
  }
  render() {
    return (
      <View
        style={{
          width: 200,
          margin: 50,
          aspectRatio: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text>{PathChangingFillFromValueToUndefined.title}</Text>
        <Button onPress={this.changeFill.bind(this)} title="Change fill" />
        <Svg height="100" width="100">
          <Path
            d="M25 10 L98 65 L70 25 L16 77 L11 30 L0 4 L90 50 L50 10 L11 22 L77 95 L20 25"
            fill={this.state.fill}
          />
        </Svg>
      </View>
    );
  }
}

class PathChangingFillFromValueToFillNone extends Component<
  {},
  {fill: 'red' | 'none'}
> {
  static title =
    'Path which on a button click sets or resets fill to none value';
  constructor(props: {}) {
    super(props);
    this.state = {
      fill: 'none',
    };
  }
  changeFill() {
    this.setState({
      fill: this.state.fill !== 'none' ? 'none' : 'red',
    });
  }
  render() {
    return (
      <View
        style={{
          width: 200,
          margin: 50,
          aspectRatio: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text>{PathChangingFillFromValueToFillNone.title}</Text>
        <Button onPress={this.changeFill.bind(this)} title="Change fill" />
        <Svg height="100" width="100">
          <Path
            d="M25 10 L98 65 L70 25 L16 77 L11 30 L0 4 L90 50 L50 10 L11 22 L77 95 L20 25"
            fill={this.state.fill}
          />
        </Svg>
      </View>
    );
  }
}

export default function App() {
  return (
    <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
      <PathChangingFillFromValueToUndefined />
      <PathChangingFillFromValueToFillNone />
    </View>
  );
}

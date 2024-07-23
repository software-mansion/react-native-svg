import React, {Component} from 'react';
import {Svg, Circle, FeColorMatrix, Filter, G} from 'react-native-svg';

class ReferenceExample extends Component {
  static title = 'Reference';
  render() {
    return (
      <Svg height="150" width="150">
        <Circle cx="75" cy="50" r="40" fill="blue" fillOpacity="0.5" />
        <Circle cx="55" cy="90" r="40" fill="green" fillOpacity="0.5" />
        <Circle cx="95" cy="90" r="40" fill="red" fillOpacity="0.5" />
      </Svg>
    );
  }
}
class IdentityExample extends Component {
  static title = 'Identity matrix';
  render() {
    return (
      <Svg height="150" width="150">
        <Filter id="filter">
          <FeColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0" />
        </Filter>
        <G filter="url(#filter)">
          <Circle cx="75" cy="50" r="40" fill="blue" fillOpacity="0.5" />
          <Circle cx="55" cy="90" r="40" fill="green" fillOpacity="0.5" />
          <Circle cx="95" cy="90" r="40" fill="red" fillOpacity="0.5" />
        </G>
      </Svg>
    );
  }
}
class RgbToGreenExample extends Component {
  static title = 'RGB to Green';
  render() {
    return (
      <Svg height="150" width="150">
        <Filter id="filter">
          <FeColorMatrix
            values="0 0 0 0 0
                    1 1 1 1 0
                    0 0 0 0 0
                    0 0 0 1 0"
          />
        </Filter>
        <G filter="url(#filter)">
          <Circle cx="75" cy="50" r="40" fill="blue" fillOpacity="0.5" />
          <Circle cx="55" cy="90" r="40" fill="green" fillOpacity="0.5" />
          <Circle cx="95" cy="90" r="40" fill="red" fillOpacity="0.5" />
        </G>
      </Svg>
    );
  }
}
class SaturateExample extends Component {
  static title = 'Saturate';
  render() {
    return (
      <Svg height="150" width="150">
        <Filter id="filter">
          <FeColorMatrix type="saturate" values="0.2" />
        </Filter>
        <G filter="url(#filter)">
          <Circle cx="75" cy="50" r="40" fill="blue" fillOpacity="0.5" />
          <Circle cx="55" cy="90" r="40" fill="green" fillOpacity="0.5" />
          <Circle cx="95" cy="90" r="40" fill="red" fillOpacity="0.5" />
        </G>
      </Svg>
    );
  }
}

class HueRotateExample extends Component {
  static title = 'Hue Rotate';
  render() {
    return (
      <Svg height="150" width="150">
        <Filter id="filter">
          <FeColorMatrix type="hueRotate" values="180" />
        </Filter>
        <G filter="url(#filter)">
          <Circle cx="75" cy="50" r="40" fill="blue" fillOpacity="0.5" />
          <Circle cx="55" cy="90" r="40" fill="green" fillOpacity="0.5" />
          <Circle cx="95" cy="90" r="40" fill="red" fillOpacity="0.5" />
        </G>
      </Svg>
    );
  }
}

class LuminanceToAlphaExample extends Component {
  static title = 'Luminance to alpha';
  render() {
    return (
      <Svg height="150" width="150">
        <Filter id="filter">
          <FeColorMatrix type="luminanceToAlpha" />
        </Filter>
        <G filter="url(#filter)">
          <Circle cx="75" cy="50" r="40" fill="blue" fillOpacity="0.5" />
          <Circle cx="55" cy="90" r="40" fill="green" fillOpacity="0.5" />
          <Circle cx="95" cy="90" r="40" fill="red" fillOpacity="0.5" />
        </G>
      </Svg>
    );
  }
}

const icon = (
  <Svg height="30" width="30" viewBox="0 0 20 20">
    <Filter id="filter">
      <FeColorMatrix values="0 0 0 0 0 1 1 1 1 0 0 0 0 0 0 0 0 0 1 0" />
    </Filter>
    <G filter="url(#filter)">
      <Circle cx="10" cy="7.5" r="5" fill="blue" fillOpacity="0.5" />
      <Circle cx="7.5" cy="12.5" r="5" fill="green" fillOpacity="0.5" />
      <Circle cx="12.5" cy="12.5" r="5" fill="red" fillOpacity="0.5" />
    </G>
  </Svg>
);

const samples = [
  ReferenceExample,
  IdentityExample,
  RgbToGreenExample,
  SaturateExample,
  HueRotateExample,
  LuminanceToAlphaExample,
];
export {icon, samples};

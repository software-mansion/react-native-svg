import React, {Component} from 'react';
import {Circle, FeGaussianBlur, Filter, G, Svg} from 'react-native-svg';

class StdDeviation5Example extends Component {
  static title = 'stdDeviation="5"';
  render() {
    return (
      <Svg height="150" width="150">
        <Filter id="filter">
          <FeGaussianBlur stdDeviation="5" />
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
class StdDeviation20Example extends Component {
  static title = 'stdDeviation="20"';
  render() {
    return (
      <Svg height="150" width="150">
        <Filter id="filter">
          <FeGaussianBlur stdDeviation="20" />
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
class StdDeviation250Example extends Component {
  static title = 'stdDeviation="25 0"';
  render() {
    return (
      <Svg height="150" width="150">
        <Filter id="filter">
          <FeGaussianBlur stdDeviation="25 0" />
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
class StdDeviation050Example extends Component {
  static title = 'stdDeviation="0 50"';
  render() {
    return (
      <Svg height="150" width="150">
        <Filter id="filter">
          <FeGaussianBlur stdDeviation="0 50" />
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
      <FeGaussianBlur stdDeviation="6" />
    </Filter>
    <G filter="url(#filter)">
      <Circle cx="10" cy="7.5" r="5" fill="blue" fillOpacity="0.5" />
      <Circle cx="7.5" cy="12.5" r="5" fill="green" fillOpacity="0.5" />
      <Circle cx="12.5" cy="12.5" r="5" fill="red" fillOpacity="0.5" />
    </G>
  </Svg>
);

const samples = [
  StdDeviation5Example,
  StdDeviation20Example,
  StdDeviation250Example,
  StdDeviation050Example,
];
export {icon, samples};

import React from 'react';
import {SafeAreaView} from 'react-native';
import {samples} from './TestingView';

export default function () {
  const e2eTab = React.createElement(samples[0]);
  return <SafeAreaView>{e2eTab}</SafeAreaView>;
}

import React from 'react';
import {View} from 'react-native';
import {SvgCss} from 'react-native-svg/css';

const xml = `
<svg width="200" height="200" viewBox="0 0 200 200">
    <style>
      #outlined {
        stroke-width: 4;
      }
    </style>
    <defs>
    <linearGradient id="myGradient">
      <stop offset="5%" stop-color="var(--gradient-start)" />
      <stop offset="95%" stop-color="var(--gradient-end)" />
    </linearGradient>
    </defs>
    <rect fill="var(--brand)" x="20" y="20" width="60" height="60" />
    <rect id="outlined" fill="none" stroke="var(--brand)" x="120" y="20" width="60" height="60" />
    <circle cx="100" cy="140" r="40" fill="url(#myGradient)" />
    <text fill="var(--brand)" x="70" y="195" font-size="16">Hello</text>
  </svg>
`;

const cssVars = {
  '--brand': '#3e3efe',
  '--gradient-start': 'gold',
  '--gradient-end': 'red',
};

export default function Test2853() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <SvgCss xml={xml} cssVars={cssVars} height="200" width="200" />
    </View>
  );
}

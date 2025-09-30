import React from 'react';
import {View} from 'react-native';
import {SvgCss} from 'react-native-svg/css';

const xml = `
<svg width="200" height="200" id="mySVG" viewBox="0 0 200 200">
    <style>
      #mySVG {
        --my-color: #ff0000;
        --color: #3e3efe;
        --green-color: green;
        --my-gold-stop-color: gold;
        --my-red-stop-color: red;
        --my-feFlood-color: green;
      }
      #newId {
        fill: purple;
        }
    </style>
    <defs>
    <linearGradient id="myGradient">
      <stop offset="5%" stop-color="var(--my-gold-stop-color)" />
      <stop offset="95%" stop-color="var(--my-red-stop-color)" />
    </linearGradient>
    <filter id="spotlight">
      <feFlood
        result="floodFill"
        x="0"
        y="0"
        width="100%"
        height="100%"
        flood-color="var(--my-feFlood-color)"
        flood-opacity="1" />
      <feBlend in="SourceGraphic" in2="floodFill" mode="multiply" />
    </filter>
    </defs>
    <rect fill="var(--color)" x="40" y="40" width="32" height="32" />
    <rect id="newId" x="80" y="40" width="32" height="32" />
    <text fill="var(--color)" x="20" y="100" stroke="var(--green-color)" stroke-width="1" font-size="16">Hello</text>
    <circle cx="140" cy="55" r="15" fill="url(#myGradient)" />

    <image
      href="https://static-00.iconduck.com/assets.00/mdn-icon-2048x1806-enhibj42.png"
      x="0"
      y="40"
      width="32"
      height="32"
      style="filter:url(#spotlight);" />
  </svg>
`;

export default function SvgComponent() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <SvgCss xml={xml} height="200" width="200" />
    </View>
  );
}

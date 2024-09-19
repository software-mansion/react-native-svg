import React from 'react';
import {SvgCss} from 'react-native-svg/css';

const xml = `
  <svg width="32" height="32" id="mySVG">
    <style>
      #mySVG {
        --my-color: #ff0000;
        --new-color: #3e3efe;
      }
    </style>
    <rect fill="var(--new-color)" x="20" y="20" width="32" height="32" />
    <text fill="var(--my-color)" x="20" y="100" font-size="16">Hello</text>
  </svg>
`;

export default function SvgComponent() {
  return <SvgCss xml={xml} height="100%" width="100%" />;
}

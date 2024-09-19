import React from 'react';
import {SvgCss} from 'react-native-svg/css';

const xml = `
  <svg width="200" height="200" id="mySVG" viewbox="0 0 200 200">
    <style>
      #mySVG {
        --my-color: #ff0000;
        --color: #3e3efe;
        --green-color: green;
      }
      #newId {
        fill: purple;
        }
    </style>
    <rect fill="var(--color)" x="40" y="40" width="32" height="32" />
    <rect id="newId" x="100" y="40" width="32" height="32" />
    <text fill="var(--color)" x="20" y="100" stroke="var(--green-color)" stroke-width="1" font-size="16">Hello</text>
  </svg>
`;

export default function SvgComponent() {
  return <SvgCss xml={xml} height="100%" width="100%" />;
}

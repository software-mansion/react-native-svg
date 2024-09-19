import React from 'react';
import {SvgCss} from 'react-native-svg/css';

const xml = `
  <svg width="32" height="32" id="mySVG">
    <style>
      #mySVG {
        --my-color: #ff0000;
        --my-width:150px;
        --my-height:200px;
      }
    </style>
    <rect fill="var(--my-color)" x="0" y="0" width="var(--my-width)" height="var(--my-height)" />
  </svg>
`;

export default function SvgComponent() {
  return <SvgCss xml={xml} height="100%" width="100%" />;
}

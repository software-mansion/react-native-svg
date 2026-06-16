import React from 'react';
import {FeMorphology, Filter, G, Rect, Svg, Text} from 'react-native-svg';

function MDNExample() {
  return (
    <Svg width="300" height="180">
      <Filter id="erode">
        <FeMorphology operator="erode" radius="1" />
      </Filter>
      <Filter id="dilate">
        <FeMorphology operator="dilate" radius="2" />
      </Filter>
      <Text fontSize={30} y="1em">
        Normal Text
      </Text>
      <Text fontSize={30} id="thin" y="2em" filter="url(#erode)">
        Thinned Text
      </Text>
      <Text fontSize={30} id="thick" y="3em" filter="url(#dilate)">
        Fattened Text
      </Text>
    </Svg>
  );
}
MDNExample.title = 'MDN Example';

function W3CExample() {
  return (
    <Svg width="350" height="300" viewBox="0 0 700 500">
      <Filter id="Erode3">
        <FeMorphology operator="erode" in="SourceGraphic" radius="3" />
      </Filter>
      <Filter id="Erode6">
        <FeMorphology operator="erode" in="SourceGraphic" radius="6" />
      </Filter>
      <Filter id="Dilate3">
        <FeMorphology operator="dilate" in="SourceGraphic" radius="3" />
      </Filter>
      <Filter id="Dilate6">
        <FeMorphology operator="dilate" in="SourceGraphic" radius="6" />
      </Filter>
      <Rect
        fill="none"
        stroke="blue"
        stroke-width="2"
        x="1"
        y="1"
        width="698"
        height="498"
      />
      <G
        fontFamily="Verdana"
        fontSize="75"
        fill="none"
        stroke="black"
        strokeWidth="6">
        <Text x="50" y="90">
          Unfiltered
        </Text>
        <Text x="50" y="180" filter="url(#Erode3)">
          Erode radius 3
        </Text>
        <Text x="50" y="270" filter="url(#Erode6)">
          Erode radius 6
        </Text>
        <Text x="50" y="360" filter="url(#Dilate3)">
          Dilate radius 3
        </Text>
        <Text x="50" y="450" filter="url(#Dilate6)">
          Dilate radius 6
        </Text>
      </G>
    </Svg>
  );
}
W3CExample.title = 'W3C Example';

const icon = (
  <Svg height="30" width="30" viewBox="0 0 20 20">
    <Filter id="Dilate1">
      <FeMorphology operator="dilate" in="SourceGraphic" radius="1" />
    </Filter>
    <Filter id="Erode0">
      <FeMorphology operator="erode" in="SourceGraphic" />
    </Filter>
    <Text x="1" y="5" fontSize={5} filter="url(#Dilate1)">
      Dilate
    </Text>
    <Text x="1" y="15" fontSize={5} filter="url(#Erode0)">
      Erode
    </Text>
  </Svg>
);
const samples = [MDNExample, W3CExample];

export {icon, samples};

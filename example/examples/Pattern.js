'use strict';
import React from 'react';
import {Example} from '../components/Example';
import {Page} from '../components/Page';
import {
  Svg,
  Rect,
  Circle,
  Path,
  Defs,
  Pattern,
  Ellipse,
  Polygon,
} from 'react-native-svg';

export const PatternPage: React.FunctionComponent<{}> = () => {
  return (
    <Page title="Pattern">
      <Example title="PatternUnits='objectBoundingBox', PatternContentUnits='userSpaceOnUse'">
        <Svg width="200" height="300">
          <Defs>
            <Pattern id="Pattern" x="0" y="0" width="25%" height="25%">
              <Rect x="0" y="0" width="50" height="50" fill="skyblue" />
              <Rect x="0" y="0" width="25" height="25" fill="red" />
              <Circle cx="25" cy="25" r="20" fill="blue" fillOpacity="0.5" />
            </Pattern>
          </Defs>
          <Rect fill="url(#Pattern)" stroke="black" width="200" height="300" />
        </Svg>
      </Example>
      <Example title="PatternUnits='objectBoundingBox', PatternContentUnits='objectBoundingBox'">
        <Svg width="200" height="300">
          <Defs>
            <Pattern
              id="Pattern"
              width="25%"
              height="25%"
              patternContentUnits="objectBoundingBox">
              <Rect x="0" y="0" width="25%" height="25%" fill="skyblue" />
              <Rect x="0" y="0" width="12.5%" height="12.5%" fill="red" />
              <Circle
                cx="12.5%"
                cy="12.5%"
                r="10%"
                fill="blue"
                fillOpacity="0.5"
              />
            </Pattern>
          </Defs>
          <Rect fill="url(#Pattern)" stroke="black" width="200" height="300" />
        </Svg>
      </Example>
      <Example title="PatternUnits='userSpaceOnUse', PatternContentUnits='userSpaceOnUse'">
        <Svg width="200" height="300">
          <Defs>
            <Pattern
              id="Pattern"
              x="10"
              y="10"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse">
              <Rect x="0" y="0" width="50" height="50" fill="skyblue" />
              <Rect x="0" y="0" width="25" height="25" fill="red" />
              <Circle cx="25" cy="25" r="20" fill="blue" fillOpacity="0.5" />
            </Pattern>
          </Defs>
          <Rect fill="url(#Pattern)" stroke="black" width="200" height="300" />
        </Svg>
      </Example>
      <Example title="Pattern with patternUnits='userSpaceOnUse'">
        <Svg width="400" height="200" viewBox="0 0 800 400">
          <Defs>
            <Pattern
              id="TrianglePattern"
              patternUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="100"
              height="100"
              viewBox="0 0 10 10">
              <Path d="M 0 0 L 7 0 L 3.5 7 z" fill="red" stroke="blue" />
            </Pattern>
          </Defs>
          <Rect
            fill="none"
            stroke="blue"
            x="1"
            y="1"
            width="798"
            height="398"
          />
          <Ellipse
            fill="url(#TrianglePattern)"
            stroke="black"
            strokeWidth="5"
            cx="400"
            cy="200"
            rx="350"
            ry="150"
          />
        </Svg>
      </Example>
      <Example title="Star">
        <Svg width="230" height="100" viewBox="0 0 230 100">
          <Defs>
            <Pattern id="star" width="10%" height="10%" viewBox="0 0 10 10">
              <Polygon
                points="0,0 2,5 0,10 5,8 10,10 8,5 10,0 5,2"
                fill="black"
              />
            </Pattern>
          </Defs>
          <Circle cx="50" cy="50" r="50" fill="url(#star)" />
          <Circle
            cx="180"
            cy="50"
            r="40"
            fill="none"
            strokeWidth="20"
            stroke="url(#star)"
          />
        </Svg>
      </Example>
    </Page>
  );
};

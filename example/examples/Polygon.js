'use strict';
import React from 'react';
import {Example} from '../components/Example';
import {Page} from '../components/Page';
import {Svg, G, Polygon} from 'react-native-svg-desktop';

export const PolygonPage: React.FunctionComponent<{}> = () => {
  return (
    <Page title="Polygon">
      <Example title="The following example creates a polygon with three sides">
        <Svg height="100" width="100">
          <Polygon
            points="40,5 70,80 25,95"
            fill="lime"
            stroke="purple"
            strokeWidth="1"
          />
        </Svg>
      </Example>
      <Example title="The following example creates a polygon with four sides">
        <Svg height="100" width="100">
          <Polygon
            points="70 5 90  75 45 90 25 80"
            fill="lime"
            stroke="purple"
            strokeWidth="1"
          />
        </Svg>
      </Example>
      <Example title="Use the <Polygon /> element to create a star">
        <Svg height="105" width="105">
          <G scale="0.5">
            <Polygon
              points="100,10 40,198 190,78 10,78 160,198"
              fill="lime"
              stroke="purple"
              strokeWidth="5"
            />
          </G>
        </Svg>
      </Example>
      <Example title="Change the fill-rule property to 'evenodd'">
        <Svg height="105" width="105">
          <G scale="0.5" fillRule="evenodd">
            <Polygon
              points="100,10 40,198 190,78 10,78 160,198"
              fill="lime"
              stroke="purple"
              strokeWidth="5"
            />
          </G>
        </Svg>
      </Example>
    </Page>
  );
};

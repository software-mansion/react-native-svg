'use strict';
import React from 'react';
import {Example} from '../components/Example';
import {Page} from '../components/Page';
import {Svg, Polyline} from 'react-native-svg';

export const PolylinePage: React.FunctionComponent<{}> = () => {
  return (
    <Page title="Polyline">
      <Example title="The <Polyline> element is used to create any shape that consists of only straight lines">
        <Svg height="100" width="100">
          <Polyline
            points="10 10 20 12 30 20 40 60 60 70 95 90"
            fill="none"
            stroke="black"
            strokeWidth="3"
          />
        </Svg>
      </Example>
      <Example title="Another example with only straight lines">
        <Svg height="100" width="100">
          <Polyline
            points="0,20 20,20 20,40 40,40 40,60 60,60 60,80"
            fill="none"
            stroke="red"
            strokeWidth="2"
          />
        </Svg>
      </Example>
      <Example title="Fill Polyline">
        <Svg height="100" width="100">
          <Polyline
            points="10,10 20,12 30,20 40,60 60,70 95,90"
            fill="red"
            stroke="black"
            strokeWidth="3"
          />
        </Svg>
      </Example>
      <Example title="Stroke Polyline with strokeLinecap and strokeLinejoin">
        <Svg height="100" width="100">
          <Polyline
            points="10,10 30,10 30,60 60,70 95,90"
            fill="none"
            stroke="blue"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </Example>
    </Page>
  );
};

'use strict';
import React from 'react';
import {Example} from '../components/Example';
import {Page} from '../components/Page';
import {Svg, Use, Symbol, Circle} from 'react-native-svg';

export const ReusablePage: React.FunctionComponent<{}> = () => {
  return (
    <Page title="Reusable">
      <Example title="Symbol example, reuse elements with viewBox prop">
        <Svg height="150" width="110">
          <Symbol id="example-symbol" viewBox="0 0 150 110">
            <Circle
              cx="50"
              cy="50"
              r="40"
              strokeWidth="8"
              stroke="red"
              fill="red"
            />
            <Circle
              cx="90"
              cy="60"
              r="40"
              strokeWidth="8"
              stroke="green"
              fill="white"
            />
          </Symbol>
          <Use href="#example-symbol" x="0" y="0" width="100" height="50" />
          <Use href="#example-symbol" x="0" y="50" width="75" height="38" />
          <Use href="#example-symbol" x="0" y="100" width="50" height="25" />
        </Svg>
      </Example>
    </Page>
  );
};

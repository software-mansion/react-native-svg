import React from 'react';
import {Circle, G, Svg} from 'react-native-svg';
import PolygonBunny from './PolygonBunny';
import WorldMap from './WorldMap';

const PolygonBunnyExample = () => <PolygonBunny />;
PolygonBunnyExample.title = 'Polygon Bunny';

const WorldMapExample = () => <WorldMap />;
WorldMapExample.title = 'WorldMap';

const icon = (
  <Svg height="30" width="30" viewBox="0 0 20 20">
    <G fill="purple">
      <Circle cx="5" cy="5" r="3" />
      <Circle cx="5" cy="15" r="3" />
      <Circle cx="8" cy="8" r="3" />
      <Circle cx="8" cy="12" r="3" />
      <Circle cx="12" cy="8" r="3" />
      <Circle cx="12" cy="12" r="3" />
      <Circle cx="15" cy="5" r="3" />
      <Circle cx="15" cy="15" r="3" />
    </G>
  </Svg>
);
const samples = [PolygonBunnyExample, WorldMapExample];

export {icon, samples};

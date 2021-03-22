'use strict';
import React from 'react';
import {Welcome} from './Welcome';
import {RectPage} from './examples/Rect';
import {PathPage} from './examples/Path';
import {PolygonPage} from './examples/Polygon';
import {PolylinePage} from './examples/Polyline';



interface ISVGExample {
  key: string;
  component: React.ElementType;
}

export const SVGExampleList: Array<ISVGExample> = [
{
    key: 'Welcome',
    component: Welcome,
  },
  {
    key: 'Rect',
    component: RectPage,
  },
  {
    key: 'Path',
    component: PathPage,
  },
  {
    key: 'Polygon',
    component: PolygonPage,
  },
  {
    key: 'Polyline',
    component: PolylinePage,
  },
];

export default SVGExampleList;

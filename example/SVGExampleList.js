'use strict';
import React from 'react';
import {Welcome} from './Welcome';
import {SvgPage} from './examples/Svg';
import {RectPage} from './examples/Rect';
import {CirclePage} from './examples/Circle';
import {EllipsePage} from './examples/Ellipse';
import {LinePage} from './examples/Line';
import {PathPage} from './examples/Path';
import {PolygonPage} from './examples/Polygon';
import {PolylinePage} from './examples/Polyline';
import {ReusablePage} from './examples/Reusable';
import {GradientsPage} from './examples/Gradients';

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
    key: 'Svg',
    component: SvgPage,
  },
  {
    key: 'Rect',
    component: RectPage,
  },
  {
    key: 'Circle',
    component: CirclePage,
  },
  {
    key: 'Ellipse',
    component: EllipsePage,
  },
  {
    key: 'Line',
    component: LinePage,
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
  {
    key: 'Reusable',
    component: ReusablePage,
  },
  {
    key: 'Gradients',
    component: GradientsPage,
  },
];

export default SVGExampleList;

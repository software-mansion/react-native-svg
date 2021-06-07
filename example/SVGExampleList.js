'use strict';
import React from 'react';
import {Welcome} from './Welcome';
import {SvgPage} from './examples/Svg';
import {SvgUriPage} from './examples/SvgUri';
import {GroupPage} from './examples/G';
import {RectPage} from './examples/Rect';
import {CirclePage} from './examples/Circle';
import {EllipsePage} from './examples/Ellipse';
import {LinePage} from './examples/Line';
import {PathPage} from './examples/Path';
import {PolygonPage} from './examples/Polygon';
import {PolylinePage} from './examples/Polyline';
import {ReusablePage} from './examples/Reusable';
import {GradientsPage} from './examples/Gradients';
import {StrokingPage} from './examples/Stroking';
import {PatternPage} from './examples/Pattern';
import {ImagePage} from './examples/Image';
import {TextPage} from './examples/Text';

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
    key: 'SvgUri',
    component: SvgUriPage,
  },
  {
    key: 'G',
    component: GroupPage,
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
    key: 'Image',
    component: ImagePage,
  },
  {
    key: 'Reusable',
    component: ReusablePage,
  },
  {
    key: 'Gradients',
    component: GradientsPage,
  },
  {
    key: 'Stroking',
    component: StrokingPage,
  },
  {
    key: 'Pattern',
    component: PatternPage,
  },
  {
    key: 'Text',
    component: TextPage,
  },
];

export default SVGExampleList;

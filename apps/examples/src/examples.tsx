import * as Svg from './examples/Svg';
import * as Rect from './examples/Rect';
import * as Circle from './examples/Circle';
import * as Ellipse from './examples/Ellipse';
import * as Line from './examples/Line';
import * as Polygon from './examples/Polygon';
import * as Polyline from './examples/Polyline';
import * as Path from './examples/Path';
import * as Text from './examples/Text';
import * as G from './examples/G';
import * as Stroking from './examples/Stroking';
import * as Gradients from './examples/Gradients';
import * as Clipping from './examples/Clipping';
import * as Image from './examples/Image';
import * as Reusable from './examples/Reusable';
import * as TouchEvents from './examples/TouchEvents';
import * as PanResponder from './examples/PanResponder';
import * as Reanimated from './examples/Reanimated';
import * as Transforms from './examples/Transforms';
import * as Markers from './examples/Markers';
import * as Mask from './examples/Mask';
import * as E2E from './e2e/TestingView';
import * as Filters from './examples/Filters';
import * as FilterImage from './examples/FilterImage';

interface Example {
  icon?: any;
  title: string;
  samples: any;
  missingOnFabric?: boolean;
  shouldBeRenderInView?: boolean;
}

export const EXAMPLES: Record<string, Example> = {
  SvgExample: {
    icon: Svg.icon,
    title: 'Svg example',
    samples: Svg.samples,
  },
  RectExample: {
    icon: Rect.icon,
    title: 'Rect example',
    samples: Rect.samples,
  },
  CircleExample: {
    icon: Circle.icon,
    title: 'Circle example',
    samples: Circle.samples,
  },
  EllipseExample: {
    icon: Ellipse.icon,
    title: 'Ellipse example',
    samples: Ellipse.samples,
  },
  LineExample: {
    icon: Line.icon,
    title: 'Line example',
    samples: Line.samples,
  },
  PolygonExample: {
    icon: Polygon.icon,
    title: 'Polygon example',
    samples: Polygon.samples,
  },
  PolylineExample: {
    icon: Polyline.icon,
    title: 'Polyline example',
    samples: Polyline.samples,
  },
  PathExample: {
    icon: Path.icon,
    title: 'Path example',
    samples: Path.samples,
  },
  TextExample: {
    icon: Text.icon,
    title: 'Text example',
    samples: Text.samples,
  },
  GExample: {
    icon: G.icon,
    title: 'G example',
    samples: G.samples,
  },
  StrokingExample: {
    icon: Stroking.icon,
    title: 'Stroking example',
    samples: Stroking.samples,
  },
  GradientsExample: {
    icon: Gradients.icon,
    title: 'Gradients example',
    samples: Gradients.samples,
  },
  ClippingExample: {
    icon: Clipping.icon,
    title: 'Clipping example',
    samples: Clipping.samples,
  },
  ImageExample: {
    icon: Image.icon,
    title: 'Image example',
    samples: Image.samples,
  },
  ReusableExample: {
    icon: Reusable.icon,
    title: 'Reusable example',
    samples: Reusable.samples,
  },
  TouchEventsExample: {
    icon: TouchEvents.icon,
    title: 'TouchEvents example',
    samples: TouchEvents.samples,
  },
  PanResponderExample: {
    icon: PanResponder.icon,
    title: 'PanResponder example',
    samples: PanResponder.samples,
    shouldBeRenderInView: true,
  },
  ReanimatedExample: {
    icon: Reanimated.icon,
    title: 'Reanimated example',
    samples: Reanimated.samples,
  },
  TransformsExample: {
    icon: Transforms.icon,
    title: 'Transforms example',
    samples: Transforms.samples,
  },
  MarkersExample: {
    icon: Markers.icon,
    title: 'Markers example',
    samples: Markers.samples,
  },
  MaskExample: {
    icon: Mask.icon,
    title: 'Mask example',
    samples: Mask.samples,
  },
  E2EExample: {
    icon: E2E.icon,
    title: 'E2E example',
    samples: E2E.samples[0],
  },
  FiltersExample: {
    icon: Filters.icon,
    title: 'Filters example',
    samples: Filters.samples[0],
  },
  FilterImageExample: {
    icon: FilterImage.icon,
    title: 'FilterImage example',
    samples: FilterImage.samples[0],
  },
};

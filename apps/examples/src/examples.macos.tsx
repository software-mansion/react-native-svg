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
    samples: Circle.CircleExample,
  },
  EllipseExample: {
    icon: Ellipse.icon,
    title: 'Ellipse example',
    samples: Ellipse.EllipseExample,
  },
  LineExample: {
    icon: Line.icon,
    title: 'Line example',
    samples: Line.LineExample,
  },
  PolygonExample: {
    icon: Polygon.icon,
    title: 'Polygon example',
    samples: Polygon.PolygonExample,
  },
  PolylineExample: {
    icon: Polyline.icon,
    title: 'Polyline example',
    samples: Polyline.PolylineExample,
  },
  PathExample: {
    icon: Path.icon,
    title: 'Path example',
    samples: Path.PathExample,
  },
  TextExample: {
    icon: Text.icon,
    title: 'Text example',
    samples: Text.TextExample,
  },
  GExample: {
    icon: G.icon,
    title: 'G example',
    samples: G.GExample,
  },
  StrokingExample: {
    icon: Stroking.icon,
    title: 'Stroking example',
    samples: Stroking.StrokeExample,
  },
  GradientsExample: {
    icon: Gradients.icon,
    title: 'Gradients example',
    samples: Gradients.LinearGradientHorizontal,
  },
  ClippingExample: {
    icon: Clipping.icon,
    title: 'Clipping example',
    samples: Clipping.ClipPathElement,
  },
  ImageExample: {
    icon: Image.icon,
    title: 'Image example',
    samples: Image.ImageExample,
  },
  ReusableExample: {
    icon: Reusable.icon,
    title: 'Reusable example',
    samples: Reusable.UseExample,
  },
  TouchEventsExample: {
    icon: TouchEvents.icon,
    title: 'TouchEvents example',
    samples: TouchEvents.PressExample,
  },
  PanResponderExample: {
    icon: PanResponder.icon,
    title: 'PanResponder example',
    samples: PanResponder.PanExample,
  },
  ReanimatedExample: {
    icon: Reanimated.icon,
    title: 'Reanimated example',
    samples: Reanimated.ReanimatedRectExample,
  },
  TransformsExample: {
    icon: Transforms.icon,
    title: 'Transforms example',
    samples: Transforms.PatternTransformExample,
  },
  MarkersExample: {
    icon: Markers.icon,
    title: 'Markers example',
    samples: Markers.EllipseExample,
  },
  MaskExample: {
    icon: Mask.icon,
    title: 'Mask example',
    samples: Mask.SimpleMask,
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

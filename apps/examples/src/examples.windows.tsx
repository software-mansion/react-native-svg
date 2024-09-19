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
  screen: any;
  missingOnFabric?: boolean;
}

export const EXAMPLES: Record<string, Example> = {
  SvgExample: {
    icon: Svg.icon,
    title: 'Svg example',
    screen: Svg.SvgComponent,
  },
  RectExample: {
    icon: Rect.icon,
    title: 'Rect example',
    screen: Rect.RectExample,
  },
  CircleExample: {
    icon: Circle.icon,
    title: 'Circle example',
    screen: Circle.CircleExample,
  },
  EllipseExample: {
    icon: Ellipse.icon,
    title: 'Ellipse example',
    screen: Ellipse.EllipseExample,
  },
  LineExample: {
    icon: Line.icon,
    title: 'Line example',
    screen: Line.LineExample,
  },
  PolygonExample: {
    icon: Polygon.icon,
    title: 'Polygon example',
    screen: Polygon.PolygonExample,
  },
  PolylineExample: {
    icon: Polyline.icon,
    title: 'Polyline example',
    screen: Polyline.PolylineExample,
  },
  PathExample: {
    icon: Path.icon,
    title: 'Path example',
    screen: Path.PathExample,
  },
  TextExample: {
    icon: Text.icon,
    title: 'Text example',
    screen: Text.TextExample,
  },
  GExample: {
    icon: G.icon,
    title: 'G example',
    screen: G.GExample,
  },
  StrokingExample: {
    icon: Stroking.icon,
    title: 'Stroking example',
    screen: Stroking.StrokeExample,
  },
  GradientsExample: {
    icon: Gradients.icon,
    title: 'Gradients example',
    screen: Gradients.LinearGradientHorizontal,
  },
  ClippingExample: {
    icon: Clipping.icon,
    title: 'Clipping example',
    screen: Clipping.ClipPathElement,
  },
  ImageExample: {
    icon: Image.icon,
    title: 'Image example',
    screen: Image.ImageExample,
  },
  ReusableExample: {
    icon: Reusable.icon,
    title: 'Reusable example',
    screen: Reusable.UseExample,
  },
  TouchEventsExample: {
    icon: TouchEvents.icon,
    title: 'TouchEvents example',
    screen: TouchEvents.PressExample,
  },
  PanResponderExample: {
    icon: PanResponder.icon,
    title: 'PanResponder example',
    screen: PanResponder.PanExample,
  },
  ReanimatedExample: {
    icon: Reanimated.icon,
    title: 'Reanimated example',
    screen: Reanimated.ReanimatedRectExample,
  },
  TransformsExample: {
    icon: Transforms.icon,
    title: 'Transforms example',
    screen: Transforms.PatternTransformExample,
  },
  MarkersExample: {
    icon: Markers.icon,
    title: 'Markers example',
    screen: Markers.EllipseExample,
  },
  MaskExample: {
    icon: Mask.icon,
    title: 'Mask example',
    screen: Mask.SimpleMask,
  },
  E2EExample: {
    icon: E2E.icon,
    title: 'E2E example',
    screen: E2E.samples[0],
  },
  FiltersExample: {
    icon: Filters.icon,
    title: 'Filters example',
    screen: Filters.samples[0],
  },
  FilterImageExample: {
    icon: FilterImage.icon,
    title: 'FilterImage example',
    screen: FilterImage.samples[0],
  },
};

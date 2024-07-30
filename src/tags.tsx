import Shape from './elements/Shape';
import Rect from './elements/Rect';
import Circle from './elements/Circle';
import Ellipse from './elements/Ellipse';
import Polygon from './elements/Polygon';
import Polyline from './elements/Polyline';
import Line from './elements/Line';
import Svg from './elements/Svg';
import Path from './elements/Path';
import G from './elements/G';
import Text from './elements/Text';
import TSpan from './elements/TSpan';
import TextPath from './elements/TextPath';
import Use from './elements/Use';
import Image from './elements/Image';
import Symbol from './elements/Symbol';
import Defs from './elements/Defs';
import LinearGradient from './elements/LinearGradient';
import RadialGradient from './elements/RadialGradient';
import Stop from './elements/Stop';
import ClipPath from './elements/ClipPath';
import Pattern from './elements/Pattern';
import Mask from './elements/Mask';
import Marker from './elements/Marker';
import ForeignObject from './elements/ForeignObject';
import Filter from './elements/filters/Filter';
import FeColorMatrix from './elements/filters/FeColorMatrix';
import FeGaussianBlur from './elements/filters/FeGaussianBlur';
import FeOffset from './elements/filters/FeOffset';

export const tags = {
  circle: Circle,
  clipPath: ClipPath,
  defs: Defs,
  ellipse: Ellipse,
  filter: Filter,
  feColorMatrix: FeColorMatrix,
  feGaussianBlur: FeGaussianBlur,
  feOffset: FeOffset,
  g: G,
  image: Image,
  line: Line,
  linearGradient: LinearGradient,
  marker: Marker,
  mask: Mask,
  path: Path,
  pattern: Pattern,
  polygon: Polygon,
  polyline: Polyline,
  radialGradient: RadialGradient,
  rect: Rect,
  stop: Stop,
  svg: Svg,
  symbol: Symbol,
  text: Text,
  textPath: TextPath,
  tspan: TSpan,
  use: Use,
  foreignObject: ForeignObject,
  Shape,
} as const;

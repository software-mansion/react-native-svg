import type { CircleProps } from './elements/Circle';
import type { ClipPathProps } from './elements/ClipPath';
import type { EllipseProps } from './elements/Ellipse';
import type { FeBlendProps } from './elements/filters/FeBlend';
import type { FeColorMatrixProps } from './elements/filters/FeColorMatrix';
import type { FeComponentTransferProps } from './elements/filters/FeComponentTransfer';
import type {
  FeFuncAProps,
  FeFuncBProps,
  FeFuncGProps,
  FeFuncRProps,
} from './elements/filters/FeComponentTransferFunction';
import type { FeCompositeProps } from './elements/filters/FeComposite';
import type { FeConvolveMatrixProps } from './elements/filters/FeConvolveMatrix';
import type { FeDiffuseLightingProps } from './elements/filters/FeDiffuseLighting';
import type { FeDisplacementMapProps } from './elements/filters/FeDisplacementMap';
import type { FeDistantLightProps } from './elements/filters/FeDistantLight';
import type { FeDropShadowProps } from './elements/filters/FeDropShadow';
import type { FeFloodProps } from './elements/filters/FeFlood';
import type { FeGaussianBlurProps } from './elements/filters/FeGaussianBlur';
import type { FeImageProps } from './elements/filters/FeImage';
import type { FeMergeProps } from './elements/filters/FeMerge';
import type { FeMergeNodeProps } from './elements/filters/FeMergeNode';
import type { FeMorphologyProps } from './elements/filters/FeMorphology';
import type { FeOffsetProps } from './elements/filters/FeOffset';
import type { FePointLightProps } from './elements/filters/FePointLight';
import type { FeSpecularLightingProps } from './elements/filters/FeSpecularLighting';
import type { FeSpotLightProps } from './elements/filters/FeSpotLight';
import type { FeTileProps } from './elements/filters/FeTile';
import type { FeTurbulenceProps } from './elements/filters/FeTurbulence';
import type { FilterProps } from './elements/filters/Filter';
import type { ForeignObjectProps } from './elements/ForeignObject';
import type { GProps } from './elements/G';
import type { ImageProps } from './elements/Image';
import type { LineProps } from './elements/Line';
import type { LinearGradientProps } from './elements/LinearGradient';
import type { MarkerProps } from './elements/Marker';
import type { MaskProps } from './elements/Mask';
import type { PathProps } from './elements/Path';
import type { PatternProps } from './elements/Pattern';
import type { PolygonProps } from './elements/Polygon';
import type { PolylineProps } from './elements/Polyline';
import type { RadialGradientProps } from './elements/RadialGradient';
import type { RectProps } from './elements/Rect';
import type { StopProps } from './elements/Stop';
import type { SymbolProps } from './elements/Symbol';
import type { TextProps } from './elements/Text';
import type { TextPathProps } from './elements/TextPath';
import type { TSpanProps } from './elements/TSpan';
import type { UseProps } from './elements/Use';
import { BaseProps } from './types';
import { createComponent } from './web/CreateWebComponent';
import { SvgComponent } from './web/Svg';

export const Circle = createComponent<BaseProps & CircleProps>('circle');
export const ClipPath = createComponent<BaseProps & ClipPathProps>('clipPath');
export const Defs = createComponent<BaseProps>('defs');
export const Ellipse = createComponent<BaseProps & EllipseProps>('ellipse');

const prepareGProps = (props: BaseProps & GProps) => {
  const { x, y, ...rest } = props;
  if ((x || y) && !rest.translate) {
    rest.transform = `translate(${x || 0}, ${y || 0})`;
  }
  return rest;
};

export const FeBlend = createComponent<BaseProps & FeBlendProps>('feBlend');
export const FeColorMatrix = createComponent<BaseProps & FeColorMatrixProps>(
  'feColorMatrix'
);
export const FeComponentTransfer = createComponent<
  BaseProps & FeComponentTransferProps
>('feComponentTransfer');
export const FeComposite = createComponent<BaseProps & FeCompositeProps>(
  'feComposite'
);
export const FeConvolveMatrix = createComponent<
  BaseProps & FeConvolveMatrixProps
>('feConvolveMatrix');
export const FeDiffuseLighting = createComponent<
  BaseProps & FeDiffuseLightingProps
>('feDiffuseLighting');
export const FeDisplacementMap = createComponent<
  BaseProps & FeDisplacementMapProps
>('feDisplacementMap');
export const FeDistantLight = createComponent<BaseProps & FeDistantLightProps>(
  'feDistantLight'
);
export const FeDropShadow = createComponent<BaseProps & FeDropShadowProps>(
  'feDropShadow'
);
export const FeFlood = createComponent<BaseProps & FeFloodProps>('feFlood');
export const FeFuncA = createComponent<BaseProps & FeFuncAProps>('feFuncA');
export const FeFuncB = createComponent<BaseProps & FeFuncBProps>('feFuncB');
export const FeFuncG = createComponent<BaseProps & FeFuncGProps>('feFuncG');
export const FeFuncR = createComponent<BaseProps & FeFuncRProps>('feFuncR');
export const FeGaussianBlur = createComponent<BaseProps & FeGaussianBlurProps>(
  'feGaussianBlur'
);
export const FeImage = createComponent<BaseProps & FeImageProps>('feImage');
export const FeMerge = createComponent<BaseProps & FeMergeProps>('feMerge');
export const FeMergeNode = createComponent<BaseProps & FeMergeNodeProps>(
  'feMergeNode'
);
export const FeMorphology = createComponent<BaseProps & FeMorphologyProps>(
  'feMorphology'
);
export const FeOffset = createComponent<BaseProps & FeOffsetProps>('feOffset');
export const FePointLight = createComponent<BaseProps & FePointLightProps>(
  'fePointLight'
);
export const FeSpecularLighting = createComponent<
  BaseProps & FeSpecularLightingProps
>('feSpecularLighting');
export const FeSpotLight = createComponent<BaseProps & FeSpotLightProps>(
  'feSpotLight'
);
export const FeTile = createComponent<BaseProps & FeTileProps>('feTile');
export const FeTurbulence = createComponent<BaseProps & FeTurbulenceProps>(
  'feTurbulence'
);
export const Filter = createComponent<BaseProps & FilterProps>('filter');
export const ForeignObject = createComponent<BaseProps & ForeignObjectProps>(
  'foreignObject'
);
export const G = createComponent<BaseProps & GProps>('g', prepareGProps);

export const Image = createComponent<BaseProps & ImageProps>('image');
export const Line = createComponent<BaseProps & LineProps>('line');
export const LinearGradient = createComponent<BaseProps & LinearGradientProps>(
  'linearGradient'
);
export const Mask = createComponent<BaseProps & MaskProps>('mask');
export const Marker = createComponent<BaseProps & MarkerProps>('marker');
export const Path = createComponent<BaseProps & PathProps>('path');
export const Pattern = createComponent<BaseProps & PatternProps>('pattern');
export const Polygon = createComponent<BaseProps & PolygonProps>('polygon');
export const Polyline = createComponent<BaseProps & PolylineProps>('polyline');
export const RadialGradient = createComponent<BaseProps & RadialGradientProps>(
  'radialGradient'
);
export const Rect = createComponent<BaseProps & RectProps>('rect');
export const Stop = createComponent<BaseProps & StopProps>('stop');
export const Svg = SvgComponent;

export const Symbol = createComponent<BaseProps & SymbolProps>('symbol');
export const Text = createComponent<BaseProps & TextProps>('text');
export const TSpan = createComponent<BaseProps & TSpanProps>('tspan');
export const TextPath = createComponent<BaseProps & TextPathProps>('textPath');
export const Use = createComponent<BaseProps & UseProps>('use');

export default Svg;

import type { CircleProps } from './elements/Circle';
import type { ClipPathProps } from './elements/ClipPath';
import type { EllipseProps } from './elements/Ellipse';
import type { FeColorMatrixProps } from './elements/filters/FeColorMatrix';
import type { FeGaussianBlurProps } from './elements/filters/FeGaussianBlur';
import type { FeMergeProps } from './elements/filters/FeMerge';
import type { FeMergeNodeProps } from './elements/filters/FeMergeNode';
import type { FeOffsetProps } from './elements/filters/FeOffset';
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
import type { SvgProps } from './elements/Svg';
import type { SymbolProps } from './elements/Symbol';
import type { TextProps } from './elements/Text';
import type { TextPathProps } from './elements/TextPath';
import type { TSpanProps } from './elements/TSpan';
import type { UseProps } from './elements/Use';
import type { BaseProps } from './web/types';
import { encodeSvg, getBoundingClientRect } from './web/utils';
import { WebShape } from './web/WebShape';

export class Circle extends WebShape<BaseProps & CircleProps> {
  tag = 'circle' as const;
}

export class ClipPath extends WebShape<BaseProps & ClipPathProps> {
  tag = 'clipPath' as const;
}

export class Defs extends WebShape {
  tag = 'defs' as const;
}

export class Ellipse extends WebShape<BaseProps & EllipseProps> {
  tag = 'ellipse' as const;
}

export class FeColorMatrix extends WebShape<BaseProps & FeColorMatrixProps> {
  tag = 'feColorMatrix' as const;
}

export class FeGaussianBlur extends WebShape<BaseProps & FeGaussianBlurProps> {
  tag = 'feGaussianBlur' as const;
}

export class FeMerge extends WebShape<BaseProps & FeMergeProps> {
  tag = 'feMerge' as const;
}

export class FeMergeNode extends WebShape<BaseProps & FeMergeNodeProps> {
  tag = 'feMergeNode' as const;
}

export class FeOffset extends WebShape<BaseProps & FeOffsetProps> {
  tag = 'feOffset' as const;
}

export class Filter extends WebShape<BaseProps & FilterProps> {
  tag = 'filter' as const;
}

export class ForeignObject extends WebShape<BaseProps & ForeignObjectProps> {
  tag = 'foreignObject' as const;
}

export class G extends WebShape<BaseProps & GProps> {
  tag = 'g' as const;
  prepareProps(props: BaseProps & GProps) {
    const { x, y, ...rest } = props;

    if ((x || y) && !rest.translate) {
      rest.translate = `${x || 0}, ${y || 0}`;
    }

    return rest;
  }
}

export class Image extends WebShape<BaseProps & ImageProps> {
  tag = 'image' as const;
}

export class Line extends WebShape<BaseProps & LineProps> {
  tag = 'line' as const;
}

export class LinearGradient extends WebShape<BaseProps & LinearGradientProps> {
  tag = 'linearGradient' as const;
}

export class Marker extends WebShape<BaseProps & MarkerProps> {
  tag = 'marker' as const;
}

export class Mask extends WebShape<BaseProps & MaskProps> {
  tag = 'mask' as const;
}

export class Path extends WebShape<BaseProps & PathProps> {
  tag = 'path' as const;
}

export class Pattern extends WebShape<BaseProps & PatternProps> {
  tag = 'pattern' as const;
}

export class Polygon extends WebShape<BaseProps & PolygonProps> {
  tag = 'polygon' as const;
}

export class Polyline extends WebShape<BaseProps & PolylineProps> {
  tag = 'polyline' as const;
}

export class RadialGradient extends WebShape<BaseProps & RadialGradientProps> {
  tag = 'radialGradient' as const;
}

export class Rect extends WebShape<BaseProps & RectProps> {
  tag = 'rect' as const;
}

export class Stop extends WebShape<BaseProps & StopProps> {
  tag = 'stop' as const;
}

export class Svg extends WebShape<BaseProps & SvgProps> {
  tag = 'svg' as const;
  toDataURL(
    callback: (data: string) => void,
    options: { width?: number; height?: number } = {}
  ) {
    const ref = this.elementRef.current;

    if (ref === null) {
      return;
    }

    const rect = getBoundingClientRect(ref);

    const width = Number(options.width) || rect.width;
    const height = Number(options.height) || rect.height;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
    svg.setAttribute('width', String(width));
    svg.setAttribute('height', String(height));
    svg.appendChild(ref.cloneNode(true));

    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d');
      context?.drawImage(img, 0, 0);
      callback(canvas.toDataURL().replace('data:image/png;base64,', ''));
    };

    img.src = `data:image/svg+xml;utf8,${encodeSvg(
      new window.XMLSerializer().serializeToString(svg)
    )}`;
  }
}

export class Symbol extends WebShape<BaseProps & SymbolProps> {
  tag = 'symbol' as const;
}

export class TSpan extends WebShape<BaseProps & TSpanProps> {
  tag = 'tspan' as const;
}

export class Text extends WebShape<BaseProps & TextProps> {
  tag = 'text' as const;
}

export class TextPath extends WebShape<BaseProps & TextPathProps> {
  tag = 'textPath' as const;
}

export class Use extends WebShape<BaseProps & UseProps> {
  tag = 'use' as const;
}

export default Svg;

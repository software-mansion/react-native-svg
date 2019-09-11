import { createElement } from 'react-native-web';
import { resolve } from './lib/resolve';
import { Component } from 'react';
import { NumberProp } from './lib/extract/types';

/**
 * `react-native-svg` supports additional props that aren't defined in the spec.
 * This function replaces them in a spec conforming manner.
 *
 * @param {Object} props Properties given to us.
 * @returns {Object} Cleaned object.
 * @private
 */
function prepare(props) {
  const {
    translate,
    scale,
    rotation,
    skewX,
    skewY,
    originX,
    originY,
    fontFamily,
    fontSize,
    fontWeight,
    fontStyle,
    style,
    ...clean
  } = props;

  const transform = [];

  if (originX != null || originY != null) {
    transform.push(`translate(${originX || 0}, ${originY || 0})`);
  }
  if (translate != null) {
    transform.push(`translate(${translate})`);
  }
  if (scale != null) {
    transform.push(`scale(${scale})`);
  }
  // rotation maps to rotate, not to collide with the text rotate attribute (which acts per glyph rather than block)
  if (rotation != null) {
    transform.push(`rotate(${rotation})`);
  }
  if (skewX != null) {
    transform.push(`skewX(${skewX})`);
  }
  if (skewY != null) {
    transform.push(`skewY(${skewY})`);
  }
  if (originX != null || originY != null) {
    transform.push(`translate(${-originX || 0}, ${-originY || 0})`);
  }

  if (transform.length) {
    clean.transform = transform.join(' ');
  }

  const styles: {
    fontStyle?: string;
    fontFamily?: string;
    fontSize?: NumberProp;
    fontWeight?: NumberProp;
  } = {};

  if (fontFamily != null) {
    styles.fontFamily = fontFamily;
  }
  if (fontSize != null) {
    styles.fontSize = fontSize;
  }
  if (fontWeight != null) {
    styles.fontWeight = fontWeight;
  }
  if (fontStyle != null) {
    styles.fontStyle = fontStyle;
  }

  clean.style = resolve(style, styles);

  return clean;
}

export class Circle extends Component {
  render() {
    return createElement('circle', prepare(this.props));
  }
}

export class ClipPath extends Component {
  render() {
    return createElement('clipPath', prepare(this.props));
  }
}

export class Defs extends Component {
  render() {
    return createElement('defs', prepare(this.props));
  }
}

export class Ellipse extends Component {
  render() {
    return createElement('ellipse', prepare(this.props));
  }
}

export class G extends Component<{
  x?: NumberProp;
  y?: NumberProp;
  translate?: string;
}> {
  render() {
    const { x, y, ...rest } = this.props;

    if ((x || y) && !rest.translate) {
      rest.translate = `${x || 0}, ${y || 0}`;
    }

    return createElement('g', prepare(rest));
  }
}

export class Image extends Component {
  render() {
    return createElement('image', prepare(this.props));
  }
}

export class Line extends Component {
  render() {
    return createElement('line', prepare(this.props));
  }
}

export class LinearGradient extends Component {
  render() {
    return createElement('linearGradient', prepare(this.props));
  }
}

export class Path extends Component {
  render() {
    return createElement('path', prepare(this.props));
  }
}

export class Polygon extends Component {
  render() {
    return createElement('polygon', prepare(this.props));
  }
}

export class Polyline extends Component {
  render() {
    return createElement('polyline', prepare(this.props));
  }
}

export class RadialGradient extends Component {
  render() {
    return createElement('radialGradient', prepare(this.props));
  }
}

export class Rect extends Component {
  render() {
    return createElement('rect', prepare(this.props));
  }
}

export class Stop extends Component {
  render() {
    return createElement('stop', prepare(this.props));
  }
}

export class Svg extends Component {
  render() {
    return createElement('svg', prepare(this.props));
  }
}

export class Symbol extends Component {
  render() {
    return createElement('symbol', prepare(this.props));
  }
}

export class Text extends Component {
  render() {
    return createElement('text', prepare(this.props));
  }
}

export class TSpan extends Component {
  render() {
    return createElement('tspan', prepare(this.props));
  }
}

export class TextPath extends Component {
  render() {
    return createElement('textPath', prepare(this.props));
  }
}

export class Use extends Component {
  render() {
    return createElement('use', prepare(this.props));
  }
}

export class Mask extends Component {
  render() {
    return createElement('mask', prepare(this.props));
  }
}

export class Pattern extends Component {
  render() {
    return createElement('pattern', prepare(this.props));
  }
}

export default Svg;

import { createElement } from 'react-native-web';
import { resolve } from './lib/resolve';

/**
 * The `react-native-svg` has some non-standard api's that do not match with the
 * properties that can be applied to web SVG elements. This prepare function removes
 * those properties and adds the properties back in their correct location.
 *
 * @param {Object} props Properties given to us.
 * @returns {Object} Cleaned object.
 * @private
 */
function prepare(props) {
  /* eslint-disable eqeqeq */
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

  const styles = {};

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

export function Circle(props) {
  return createElement('circle', prepare(props));
}

export function ClipPath(props) {
  return createElement('clipPath', prepare(props));
}

export function Defs(props) {
  return createElement('defs', prepare(props));
}

export function Ellipse(props) {
  return createElement('ellipse', prepare(props));
}

export function G(props) {
  const { x, y, ...rest } = props;

  if ((x || y) && !rest.translate) {
    rest.translate = `${x || 0}, ${y || 0}`;
  }

  return createElement('g', prepare(rest));
}

export function Image(props) {
  return createElement('image', prepare(props));
}

export function Line(props) {
  return createElement('line', prepare(props));
}

export function LinearGradient(props) {
  return createElement('linearGradient', prepare(props));
}

export function Path(props) {
  return createElement('path', prepare(props));
}

export function Polygon(props) {
  return createElement('polygon', prepare(props));
}

export function Polyline(props) {
  return createElement('polyline', prepare(props));
}

export function RadialGradient(props) {
  return createElement('radialGradient', prepare(props));
}

export function Rect(props) {
  return createElement('rect', prepare(props));
}

export function Stop(props) {
  return createElement('stop', prepare(props));
}

export function Svg(props) {
  return createElement('svg', prepare(props));
}

export function Symbol(props) {
  return createElement('symbol', prepare(props));
}

export function Text(props) {
  return createElement('text', prepare(props));
}

export function TSpan(props) {
  return createElement('tspan', prepare(props));
}

export function TextPath(props) {
  return createElement('textPath', prepare(props));
}

export function Use(props) {
  return createElement('use', prepare(props));
}

export function Mask(props) {
  return createElement('mask', prepare(props));
}

export function Pattern(props) {
  return createElement('pattern', prepare(props));
}

export default Svg;

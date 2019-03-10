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

  // Correctly apply the transformation properties.
  // To apply originX and originY we need to translate the element on those values and
  // translate them back once the element is scaled, rotated and skewed.
  const transform = [];

  /* eslint-disable eqeqeq */
  if (originX != null || originY != null) {
    transform.push(`translate(${originX || 0}, ${originY || 0})`);
  }
  if (translate != null) {
    transform.push(`translate(${translate})`);
  }
  if (scale != null) {
    transform.push(`scale(${scale})`);
  }
  // rotation maps to rotate, not to collide with the text rotate attribute
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
  /* eslint-enable eqeqeq */
  clean.style = resolve(style, styles);

  return clean;
}

function Circle(props) {
  return createElement('circle', prepare(props));
}

function ClipPath(props) {
  return createElement('clipPath', prepare(props));
}

function Defs(props) {
  return createElement('defs', prepare(props));
}

function Ellipse(props) {
  return createElement('ellipse', prepare(props));
}

function G(props) {
  const { x, y, ...rest } = props;

  if ((x || y) && !rest.translate) {
    rest.translate = `${x || 0}, ${y || 0}`;
  }

  return createElement('g', prepare(rest));
}

function Image(props) {
  return createElement('image', prepare(props));
}

function Line(props) {
  return createElement('line', prepare(props));
}

function LinearGradient(props) {
  return createElement('linearGradient', prepare(props));
}

function Path(props) {
  return createElement('path', prepare(props));
}

function Polygon(props) {
  return createElement('polygon', prepare(props));
}

function Polyline(props) {
  return createElement('polyline', prepare(props));
}

function RadialGradient(props) {
  return createElement('radialGradient', prepare(props));
}

function Rect(props) {
  return createElement('rect', prepare(props));
}

function Stop(props) {
  return createElement('stop', prepare(props));
}

function Svg(props) {
  return createElement('svg', prepare(props));
}

function Symbol(props) {
  return createElement('symbol', prepare(props));
}

function Text(props) {
  return createElement('text', prepare(props));
}

function TSpan(props) {
  return createElement('tspan', prepare(props));
}

function TextPath(props) {
  return createElement('textPath', prepare(props));
}

function Use(props) {
  return createElement('use', prepare(props));
}

function Mask(props) {
  return createElement('mask', prepare(props));
}

function Pattern(props) {
  return createElement('pattern', prepare(props));
}

export {
  Circle,
  ClipPath,
  Defs,
  Ellipse,
  G,
  Image,
  Line,
  LinearGradient,
  Mask,
  Path,
  Pattern,
  Polygon,
  Polyline,
  RadialGradient,
  Rect,
  Stop,
  Svg,
  Symbol,
  TSpan,
  Text,
  TextPath,
  Use,
};

export default Svg;

import extractColor, { integerColor } from './extractColor';

const urlIdPattern = /^url\(#(.+)\)$/;

const currentColorBrush = [2];

export default function extractBrush(color) {
  if (typeof color === 'number') {
    if (color >>> 0 === color && color >= 0 && color <= 0xffffffff) {
      return [0, integerColor(color)];
    }
  }

  if (!color || color === 'none') {
    return null;
  }

  if (color === 'currentColor') {
    return currentColorBrush;
  }

  const brush = typeof color === 'string' && color.match(urlIdPattern);
  if (brush) {
    return [1, brush[1]];
  }

  const int32ARGBColor = extractColor(color);
  if (typeof int32ARGBColor === 'number') {
    return [0, int32ARGBColor];
  }

  console.warn(`"${color}" is not a valid color or brush`);
  return null;
}

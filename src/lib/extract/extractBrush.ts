import { ColorValue, processColor } from 'react-native';

const urlIdPattern = /^url\(#(.+)\)$/;

const currentColorBrush = [2];
const contextFillBrush = [3];
const contextStrokeBrush = [4];

export default function extractBrush(color?: ColorValue) {
  if (!color || color === 'none') {
    return null;
  }

  if (color === 'currentColor') {
    return currentColorBrush;
  }

  if (color === 'context-fill') {
    return contextFillBrush;
  }

  if (color === 'context-stroke') {
    return contextStrokeBrush;
  }

  const brush = typeof color === 'string' && color.match(urlIdPattern);
  if (brush) {
    return [1, brush[1]];
  }

  const processedColor = processColor(color);
  if (typeof processedColor === 'number') {
    return processedColor;
  }

  if (typeof processedColor === 'object' && processedColor !== null) {
    // if we got an object, it should be `PlatformColor` or `DynamicColorIOS`,
    // so we pass it as an array with `0` value as first item, which is interpreted
    // on the native side as color to be managed by `RCTConvert`.
    return [0, processedColor];
  }

  console.warn(`"${String(color)}" is not a valid color or brush`);
  return null;
}

import type { ColorValue } from 'react-native';
import { processColor } from 'react-native';
import { convertPercentageColor } from '../utils/convertPercentageColor';

const urlIdPattern = /^url\(#(.+)\)$/;

const currentColorBrush = { type: 2 };
const contextFillBrush = { type: 3 };
const contextStrokeBrush = { type: 4 };

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
    return { type: 1, brushRef: brush[1] };
  }

  // Convert percentage RGB/RGBA color to standard RGB/RGBA color
  const colorToProcess = convertPercentageColor(color);
  const processedColor = processColor(colorToProcess);
  if (typeof processedColor === 'number') {
    return { type: 0, payload: processedColor };
  }

  if (typeof processedColor === 'object' && processedColor !== null) {
    // if we got an object, it should be `PlatformColor` or `DynamicColorIOS`,
    // so we pass it as an object with `0` value as first item, which is interpreted
    // on the native side as color to be managed by `RCTConvert`.
    return { type: 0, payload: processedColor };
  }

  console.warn(`"${String(color)}" is not a valid color or brush`);
  return null;
}

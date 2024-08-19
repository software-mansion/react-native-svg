import { ColorValue } from 'react-native';

export const RGB_RGBA_PATTERN =
  /^rgba?\(\s*(100%|\d{1,2}(\.\d+)?%)\s*,\s*(100%|\d{1,2}(\.\d+)?%)\s*,\s*(100%|\d{1,2}(\.\d+)?%)\s*(?:,\s*(1|0(\.\d+)?|100%|\d{1,2}(\.\d+)?%)\s*)?\)$/;

const percentTo255 = (percent: string) =>
  Math.round(parseFloat(percent) * 2.55);

const parseAlpha = (alpha: string) =>
  alpha.endsWith('%') ? parseFloat(alpha) / 100 : parseFloat(alpha);

function parsePercentageRGBColor(color: string): string {
  const currentMatch = RGB_RGBA_PATTERN.exec(color);

  if (!currentMatch) {
    console.warn(`"${color}" is not a valid percentage rgb/rgba color`);
    return color;
  }

  const red = currentMatch[1];
  const green = currentMatch[3];
  const blue = currentMatch[5];
  const alpha = currentMatch[7];

  const rgb = `${percentTo255(red)}, ${percentTo255(green)}, ${percentTo255(
    blue
  )}`;

  return alpha ? `rgba(${rgb}, ${parseAlpha(alpha)})` : `rgb(${rgb})`;
}

export const convertPercentageColor = (color: ColorValue) => {
  if (typeof color !== 'string') {
    return color;
  }
  const rgbColorWithoutSpaces = color.replace(/\s/g, '');
  const isPercentageRgb = RGB_RGBA_PATTERN.test(rgbColorWithoutSpaces);
  return isPercentageRgb
    ? parsePercentageRGBColor(rgbColorWithoutSpaces)
    : color;
};

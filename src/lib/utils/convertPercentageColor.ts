import { ColorValue } from 'react-native';

export const RGB_PATTERN =
  /^rgb\(\s*(100%|100|\d{1,2}(\.\d+)?%)\s*,\s*(100%|100|\d{1,2}(\.\d+)?%)\s*,\s*(100%|100|\d{1,2}(\.\d+)?%)\s*\)$/;
export const RGBA_PATTERN =
  /^rgba\(\s*(100%|100|\d{1,2}(\.\d+)?%)\s*,\s*(100%|100|\d{1,2}(\.\d+)?%)\s*,\s*(100%|100|\d{1,2}(\.\d+)?%)\s*,\s*(1|0(\.\d+)?|100%|100|\d{1,2}(\.\d+)?%)\s*\)$/;

const percentTo255 = (percent: string) =>
  Math.round(parseFloat(percent) * 2.55);

const parseAlpha = (alpha: string) =>
  alpha.endsWith('%') ? parseFloat(alpha) / 100 : parseFloat(alpha);

function parsePercentageRGBColor(color: string): string | undefined {
  const rgbMatch = RGB_PATTERN.exec(color);
  const rgbaMatch = RGBA_PATTERN.exec(color);

  const currentMatch = rgbMatch || rgbaMatch;

  if (!currentMatch) {
    console.warn(`"${color}" is not a valid percentage rgb/rgba color`);
    return undefined;
  }

  const red = currentMatch[1];
  const green = currentMatch[3];
  const blue = currentMatch[5];
  const alpha = currentMatch.length === 10 ? currentMatch[7] : undefined;

  const rgb = `${percentTo255(red)}, ${percentTo255(green)}, ${percentTo255(
    blue
  )}`;

  return alpha ? `rgba(${rgb}, ${parseAlpha(alpha)})` : `rgb(${rgb})`;
}

export const convertPercentageColor = (color: ColorValue) => {
  const rgbColorWithoutSpaces =
    typeof color === 'string' ? color.replace(/\s/g, '') : undefined;
  const isPercentageRgb =
    rgbColorWithoutSpaces &&
    (RGB_PATTERN.test(rgbColorWithoutSpaces) ||
      RGBA_PATTERN.test(rgbColorWithoutSpaces));
  return isPercentageRgb
    ? parsePercentageRGBColor(rgbColorWithoutSpaces)
    : color;
};

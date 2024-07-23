const RGB_PATTERN = /^rgb\((\d+(\.\d+)?%)?,(\d+(\.\d+)?%)?,(\d+(\.\d+)?%)?\)$/;
const RGBA_PATTERN =
  /^rgba\((\d+(\.\d+)?%)?,(\d+(\.\d+)?%)?,(\d+(\.\d+)?%)?,\s*(\d+(\.\d+)?%?)\)$/;

const percentTo255 = (percent: string) =>
  Math.round(parseFloat(percent) * 2.55);

const parseAlpha = (alpha: string) =>
  alpha.endsWith('%') ? parseFloat(alpha) / 100 : parseFloat(alpha);

/**
 * Parses a color string in percentage RGB or RGBA format and converts it to a standard RGB or RGBA string.
 *
 * This function supports the following input formats:
 * - rgb(%) : e.g., "rgb(13.730068%,12.159915%,12.54902%)"
 * - rgba(%) : e.g., "rgba(13.730068%,12.159915%,12.54902%,50%)"
 *
 * The percentages for RGB values are converted to the 0-255 range, and the alpha value is converted
 * to a decimal if it is provided as a percentage.
 *
 * @param {string} color - The color string in percentage RGB or RGBA format.
 * @returns {string | undefined} - The converted color string in standard RGB or RGBA format, or null if the input is invalid.
 *
 * @example
 * parsePercentageRGBColor("rgb(13.730068%,12.159915%,12.54902%)"); // Returns "rgb(35, 31, 32)"
 * parsePercentageRGBColor("rgba(13.730068%,12.159915%,12.54902%,50%)"); // Returns "rgba(35, 31, 32, 0.5)"
 */
export function parsePercentageRGBColor(color: string): string | undefined {
  const rgbMatch = color.match(RGB_PATTERN);
  const rgbaMatch = color.match(RGBA_PATTERN);

  if (!rgbMatch && !rgbaMatch) {
    return undefined;
  }

  if (rgbMatch) {
    const [, r, , g, , b] = rgbMatch;
    return `rgb(${percentTo255(r)}, ${percentTo255(g)}, ${percentTo255(b)})`;
  } else if (rgbaMatch) {
    const [, r, , g, , b, , a] = rgbaMatch;
    return `rgba(${percentTo255(r)}, ${percentTo255(g)}, ${percentTo255(
      b
    )}, ${parseAlpha(a)})`;
  }
}

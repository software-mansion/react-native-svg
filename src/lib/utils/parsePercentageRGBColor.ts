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
 * @returns {string | null} - The converted color string in standard RGB or RGBA format, or null if the input is invalid.
 *
 * @example
 * parsePercentageRGBColor("rgb(13.730068%,12.159915%,12.54902%)"); // Returns "rgb(35, 31, 32)"
 * parsePercentageRGBColor("rgba(13.730068%,12.159915%,12.54902%,50%)"); // Returns "rgba(35, 31, 32, 0.5)"
 */
export function parsePercentageRGBColor(color: string) {
  const percentTo255 = (percent: string) =>
    Math.round(parseFloat(percent) * 2.55);
  const parseAlpha = (alpha: string) =>
    alpha.endsWith('%') ? parseFloat(alpha) / 100 : parseFloat(alpha);
  const rgbPattern = /^rgb\((\d+(\.\d+)?%)?,(\d+(\.\d+)?%)?,(\d+(\.\d+)?%)?\)$/;
  const rgbaPattern =
    /^rgba\((\d+(\.\d+)?%)?,(\d+(\.\d+)?%)?,(\d+(\.\d+)?%)?,\s*(\d+(\.\d+)?%?)\)$/;
  let match;

  if ((match = color.match(rgbPattern))) {
    const [, r, , g, , b] = match;
    return `rgb(${percentTo255(r)}, ${percentTo255(g)}, ${percentTo255(b)})`;
  } else if ((match = color.match(rgbaPattern))) {
    const [, r, , g, , b, , a] = match;
    return `rgba(${percentTo255(r)}, ${percentTo255(g)}, ${percentTo255(
      b
    )}, ${parseAlpha(a)})`;
  }

  return null;
}

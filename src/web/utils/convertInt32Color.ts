export function convertInt32ColorToRGBA(color: number) {
  const r = (color >> 16) & 255;
  const g = (color >> 8) & 255;
  const b = color & 255;
  const a = ((color >> 24) & 255) / 255;
  const alpha = a.toFixed(2);
  return `rgba(${r},${g},${b},${alpha})`;
}

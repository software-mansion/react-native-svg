export default function extractOpacity(opacity) {
  const value = +opacity;
  return typeof value !== 'number' || isNaN(value) ? 1 : value;
}

import type { NumberProp } from './types';

export default function extractOpacity(opacity: NumberProp | void) {
  if (typeof opacity === 'string' && opacity.trim().endsWith('%')) {
    return +opacity.slice(0, -1) / 100;
  }
  const value = +opacity;
  return isNaN(value) || value > 1 ? 1 : Math.max(value, 0);
}

import type { NumberProp } from './types';

export default function extractOpacity(opacity: NumberProp | void) {
  const value =
    typeof opacity === 'string' && opacity.trim().endsWith('%')
      ? +opacity.slice(0, -1) / 100
      : +opacity;
  return isNaN(value) || value > 1 ? 1 : Math.max(value, 0);
}

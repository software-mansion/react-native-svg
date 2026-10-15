import type { NumberProp } from './types';

export default function extractPolyPoints(
  points: string | readonly NumberProp[]
) {
  const polyPoints = Array.isArray(points) ? points.join(',') : points;
  return (polyPoints as string)
    .replace(/([^eE])-/g, '$1 -')
    .split(/(?:\s+|\s*,\s*)/g)
    .join(' ');
}

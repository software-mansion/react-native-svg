import { NumberProp } from './types';

export default function extractPolyPoints(
  points: string | readonly NumberProp[],
) {
  const polyPoints = Array.isArray(points) ? points.join(',') : points;
  return (polyPoints as string)
    .replace(/[^eE]-/, ' -')
    .split(/(?:\s+|\s*,\s*)/g)
    .join(' ');
}

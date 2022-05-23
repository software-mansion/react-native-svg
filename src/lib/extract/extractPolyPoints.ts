import { NumberProp } from './types';

declare global {
  interface ArrayConstructor {
    // https://github.com/microsoft/TypeScript/issues/17002
    isArray(arg: unknown): arg is unknown[] | readonly unknown[];
  }
}

export default function extractPolyPoints(
  points: string | readonly NumberProp[],
) {
  const polyPoints = Array.isArray(points) ? points.join(',') : points;
  return polyPoints
    .replace(/[^eE]-/, ' -')
    .split(/(?:\s+|\s*,\s*)/g)
    .join(' ');
}

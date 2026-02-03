import { AlignmentBaseline } from './types';

export function parse(
  verticalAlign: string,
  options?: object
): {
  alignmentBaseline: AlignmentBaseline | null;
  baselineShift: string | null;
};

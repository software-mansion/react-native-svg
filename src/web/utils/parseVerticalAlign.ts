import { NumberProp } from '../../lib/extract/types';
import { parse } from '../../lib/extract/verticalAlign';

export const parseVerticalAlign = (verticalAlign?: NumberProp) => {
  if (!verticalAlign) {
    return { alignmentBaseline: null, baselineShift: null };
  }
  let { alignmentBaseline, baselineShift } = parse(String(verticalAlign));

  // on the web 'text-bottom' have to be mapped into 'text-after-edge'
  if (alignmentBaseline === 'text-bottom') {
    alignmentBaseline = 'text-after-edge';
  }

  // on the web 'text-top' have to be mapped into 'text-before-edge'
  if (alignmentBaseline === 'text-top') {
    alignmentBaseline = 'text-before-edge';
  }

  return { alignmentBaseline, baselineShift };
};
